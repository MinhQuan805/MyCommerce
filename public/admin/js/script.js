// Button Status
const buttonStatus = document.querySelectorAll("[button-status]");
if (buttonStatus.length > 0) {
    let url = new URL(window.location.href);
    buttonStatus.forEach(button => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");

            if (status) {
                url.searchParams.set("status", status);
            }
            else {
                url.searchParams.delete("status");
            }
            window.location.href = url.href;
        });
    });
}

// End Button Status


// Form Search
const formSearch = document.querySelector("#form-search");
if (formSearch) {
    let url = new URL(window.location.href);
    formSearch.addEventListener("submit", (event) => {
        event.preventDefault();
        const keyword = event.target.elements.keyword.value;
        if (keyword) {
            url.searchParams.set("keyword", keyword);
        }
        else {
            url.searchParams.delete("keyword");
        }
        window.location.href = url.href;
    });
}
// End Form Search

// Pagination Button
const buttonsPagination = document.querySelectorAll("[button-pagination]")
if (buttonsPagination.length > 0) {
    let url = new URL(window.location.href);
    buttonsPagination.forEach(button => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagination");
            if (page) {
                url.searchParams.set("page", page);
            }
            else {
                url.searchParams.delete("page");
            }
            window.location.href = url.href;
        });
    });
}
// End Pagination

// Start CheckBox All
const checkboxMulti = document.querySelector("[checkbox-multi]");
if (checkboxMulti) {
    const boxCheckAll = checkboxMulti.querySelector("input[name='checkAll']");
    const boxId = checkboxMulti.querySelectorAll("input[name='id']");
    
    boxCheckAll.addEventListener("click", () => {
        if (boxCheckAll.checked) {
            boxId.forEach((box) => {
                box.checked = true;
            })
        }
        else {
            boxId.forEach((box) => {
                box.checked = false;
            })
        }
    })

    boxId.forEach((box) => 
        box.addEventListener("click", () => {
            const countBoxChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length;
            if (countBoxChecked != boxId.length) {
                boxCheckAll.checked = false;
            }
            else {
                boxCheckAll.checked = true;
            }
        })
    )
}
// End CheckBox All

// Form Change Multi Check
const FormChange = document.querySelector("[form-change-multi]");
if (FormChange) {
    FormChange.addEventListener("submit", (e) => {
        e.preventDefault();
        const boxIdChecked = checkboxMulti.querySelectorAll("input[name='id']:checked");
        const typeChange = e.target.elements.type.value;
        if (typeChange == "delete-all") {
                const isConfirm = confirm("Bạn có chắc muốn xóa sản phầm này không?");
                if (!isConfirm) {
                    return;
                }
        }
        if (boxIdChecked.length > 0) {
            let ids = [];
            const inputIds = FormChange.querySelector("input[name='ids']");
            boxIdChecked.forEach((box) => {
                const id = box.value;
                if (typeChange == "change-position") {
                    const position = box.closest("tr") //Closest dùng để tìm phần tử cha gần nhất với yêu cầu
                                        .querySelector("input[name='position']").value;
                    ids.push(`${id}-${position}`) // Truyền vào controller id và và vị trí thay đổi
                }
                else {
                    ids.push(id); // Truyền vào controller id để xóa hoặc cập nhật
                }
            });
            inputIds.value = ids.join(", ");
            FormChange.submit();
        }
        else {
            alert("Vui lòng chọn ít nhất một ô!");
        }
    })
}
// End Form

// Show Alert
const ShowAlert = document.querySelector("[show-alert]");
if (ShowAlert) {
    const time = parseInt(ShowAlert.getAttribute("data-time"));
    const CloseAlert = ShowAlert.querySelector("[close-alert]");
    setTimeout(() => {
        ShowAlert.classList.add("hidden-alert");
    }, time);

    CloseAlert.addEventListener("click", () => {
        ShowAlert.classList.add("hidden-alert");
    });
}
// End Alert