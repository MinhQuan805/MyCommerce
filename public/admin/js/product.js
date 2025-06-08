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
            
            formChangeStatus.action = path + `/${statusChange}/${id}?_method=PATCH`;

            formChangeStatus.submit();
        })
    })
}

// Tính năng xóa sản phẩm
const buttonsDelete = document.querySelectorAll("[button-delete-item]");
if (buttonsDelete.length > 0) {
    buttonsDelete.forEach(button => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có chắc muốn xóa sản phẩm này");
            if (isConfirm) {
                const id = button.getAttribute("data-id");
                const formDelete = document.getElementById("form-delete");
                
                const path = formDelete.getAttribute("data-path");
                
                formDelete.action = `${path}/${id}?_method=DELETE`;
                formDelete.submit();
            }
        })
    })
}