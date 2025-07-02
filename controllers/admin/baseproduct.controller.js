// controllers/base.controller.js
class BaseController {
  constructor(Model, options = {}) {
    this.Model = Model;
    this.viewPath = options.viewPath;
    this.pageTitle = options.pageTitle || "Danh sách";
    this.modelName = options.modelName || "items";
  }

  async index(req, res) {
    const filterStatus = require("../../helpers/filterStatus")(req.query);
    const searchHelper = require("../../helpers/search");
    const paginationHelper = require("../../helpers/pagination");

    let find = { deleted: false };
    if (req.query.status) find.status = req.query.status;

    const searchObject = searchHelper(req.query);
    if (searchObject.regex) find.title = searchObject.regex;

    let paginationObject = { currentPage: 1, limitItem: 4 };
    const count = await this.Model.countDocuments(find);
    paginationObject = paginationHelper(paginationObject, req.query, count);

    let sort = {};
    if (req.query.sortkey && req.query.sortvalue) {
      sort[req.query.sortkey] = req.query.sortvalue;
    } else {
      sort.position = "desc";
    }

    const records = await this.Model.find(find)
      .limit(paginationObject.limitItem)
      .sort(sort)
      .skip(paginationObject.skip);

    this.handlePolymorphism(records); // đa hình: tùy từng model xử lý khác nhau

    res.render(`${this.viewPath}/index`, {
      pageTitle: this.pageTitle,
      [this.modelName]: records,
      filterStatus,
      keyword: searchObject.keyword,
      pagination: paginationObject,
    });
  }

  async changeStatus(req, res) {
    const { id, status } = req.params;
    await this.Model.updateOne({ _id: id }, { status });
    req.flash("success", "Cập nhật trạng thái thành công!");
    res.redirect(req.header("Referer") || "/");
  }

  async changeMulti(req, res) {
    const { type, ids: rawIds } = req.body;
    const ids = rawIds.split(", ");
    switch (type) {
      case "active":
      case "inactive":
        await this.Model.updateMany({ _id: { $in: ids } }, { status: type });
        req.flash("success", `Cập nhật trạng thái thành công ${ids.length}!`);
        break;
      case "delete-all":
        await this.Model.updateMany({ _id: { $in: ids } }, { deleted: true, deletedAt: new Date() });
        req.flash("success", `Xóa thành công ${ids.length}!`);
        break;
      case "change-position":
        for (const item of ids) {
          let [id, pos] = item.split("-");
          await this.Model.updateOne({ _id: id }, { position: parseInt(pos) });
        }
        req.flash("success", `Thay đổi vị trí thành công ${ids.length}!`);
        break;
    }
    res.redirect(req.header("Referer") || "/");
  }

  async deleteItem(req, res) {
    const id = req.params.id;
    await this.Model.updateOne({ _id: id }, { deleted: true, deletedAt: new Date() });
    req.flash("success", "Xóa thành công!");
    res.redirect(req.header("Referer") || "/");
  }

  async create(req, res) {
    res.render(`${this.viewPath}/create`, { pageTitle: `Tạo mới ${this.pageTitle}` });
  }

  async createPost(req, res) {
    if (!req.body.position) {
      const count = await this.Model.countDocuments();
      req.body.position = count + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }

    this.prepareDataBeforeSave(req.body);

    const newDoc = new this.Model(req.body);
    await newDoc.save();
    res.redirect(`${require("../../config/system").prefixAdmin}/${this.modelName}`);
  }

  async edit(req, res) {
    const { id } = req.params;
    try {
      const item = await this.Model.findOne({ _id: id, deleted: false });
      res.render(`${this.viewPath}/edit`, { pageTitle: "Chỉnh sửa", product: item });
    } catch (err) {
      req.flash("error", "Không tìm thấy sản phẩm!");
      res.redirect(`${require("../../config/system").prefixAdmin}/${this.modelName}`);
    }
  }

  async editPost(req, res) {
    const { id } = req.params;
    req.body.position = parseInt(req.body.position);
    this.prepareDataBeforeSave(req.body);

    try {
      await this.Model.updateOne({ _id: id }, req.body);
      req.flash("success", "Cập nhật thành công!");
    } catch (err) {
      req.flash("error", "Cập nhật thất bại!");
    }
    res.redirect(`${require("../../config/system").prefixAdmin}/${this.modelName}`);
  }

  async detail(req, res) {
    const { id } = req.params;
    try {
      const item = await this.Model.findOne({ _id: id, deleted: false });
      this.handlePolymorphismDetail(item);
      res.render(`${this.viewPath}/detail`, { pageTitle: "Chi tiết", product: item });
    } catch (err) {
      req.flash("error", "Không thể xem chi tiết!");
      res.redirect(`${require("../../config/system").prefixAdmin}/${this.modelName}`);
    }
  }

  // --- Hooks để override (đa hình) ---
  prepareDataBeforeSave(data) {}
  handlePolymorphism(records) {}
  handlePolymorphismDetail(item) {}
}

module.exports = BaseController;
