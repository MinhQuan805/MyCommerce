const tablePermission = document.querySelector("[table-permission]");
if (tablePermission) {
    const permissionChange = document.querySelector("[button-submit]");
    permissionChange.addEventListener("click", () => {
        let permission = [];
        const rows = tablePermission.querySelectorAll("[data-name]");
        rows.forEach((row) => {
            const name = row.getAttribute("data-name");
            const inputs = row.querySelectorAll("input");
            if (name == "id") {
                inputs.forEach(input => {
                    permission.push({
                        id: input.value,
                        permissions: [],
                    })
                })
            }
            else {
                inputs.forEach((input, index) => {
                    if (input.checked) {
                        permission[index].permissions.push(name);
                    }
                })
            }
        })
        if (permission.length > 0) {
            const formChangePermission = document.querySelector("#form-change-permissions");
            const inputPermissions = formChangePermission.querySelector("input[name='permissions']");
            inputPermissions.value = JSON.stringify(permission);
            formChangePermission.submit();
        }
    });
}


const dataRecords = document.querySelector("[data-records]");
if (dataRecords) {
    const records = JSON.parse(dataRecords.getAttribute("data-records"));
    const tablePermission = document.querySelector("[table-permission]");
    records.forEach((record, index) => {  
        const permissions = record.permissions;
        permissions.forEach(permission => {
            const row = tablePermission.querySelector(`[data-name="${permission}"]`);
            const input = row.querySelectorAll("input")[index];
            input.checked = true;
        })
    })
}