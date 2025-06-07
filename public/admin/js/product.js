// Tính năng thay đổi trạng thái sản phẩm
const buttonChangeStatus = document.querySelectorAll("[button-change-status]");
if (buttonChangeStatus.length > 0) {
    buttonChangeStatus.forEach(button => {
        button.addEventListener("click", () => {
            const statusCurrent = button.getAttribute("data-status");
            const id = button.getAttribute("data-id");

            let statusChange = statusCurrent == "active" ? "inactive" : "active";
            
            const formChangeStatus = document.getElementById("form-change-status");
            const path = formChangeStatus.getAttribute("data-path");
            formChangeStatus.action = path + `/${statusChange}/${id}`;
            formChangeStatus.submit();
        })
    })
}