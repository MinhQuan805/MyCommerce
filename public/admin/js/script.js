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

// Form Check
const FormChange = document.querySelector("[form-change-multi]");
if (FormChange) {
    FormChange.addEventListener("submit", (e) => {
        e.preventDefault();
        const boxIdChecked = checkboxMulti.querySelectorAll("input[name='id']:checked");
        if (boxIdChecked.length > 0) {
            let ids = [];
            const inputIds = FormChange.querySelector("input[name='ids']");
            boxIdChecked.forEach((box) => {
                if (box.checked) {
                    ids.push(box.value);
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