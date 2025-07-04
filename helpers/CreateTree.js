let count = 0;
const CreateTree = (records, parentID="") => {
    let tree = [];
    records.forEach(element => {
        if (element.parent_id === parentID) {
            const newElement = element;
            count++;
            newElement.index = count;
            const children = CreateTree(records, element.id) ;
            if (children.length > 0) {
                newElement.children = children;
            }
            tree.push(newElement);
        }
    });
    return tree;
}
module.exports = (records, parentID="") => {
    count = 0;
    const tree = CreateTree(records, parentID);
    return tree;
}