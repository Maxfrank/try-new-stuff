const paths = [
    'A/B/F',
    'A/B/E',
    'A/B/D',
    'A/C',
    'X/Y',
    'X/Z'
];
const clicks = ['A', 'F'];

function treeSelect(paths, clicks) {
    const All = Symbol('all');
    const None = Symbol('no');
    const Partial = Symbol('partial');
//     paths.sort();
    const map = new Map();
    paths.forEach(path => {
        path.split('/').forEach((val, i, arr) => {
            if (!map.has(val)) {
                map.set(val, { parent: i === 0 ? null : arr[i - 1], children: i === arr.length - 1 ? null : new Set(arr[i + 1]), status: None, index: i });
            } else {
                const node = map.get(val);
                if (node.children) {
                    node.children.add(arr[i + 1]);
                }
            }
        });
    });
    clicks.forEach(nodeName => {
        // update current node
        const node = map.get(nodeName);
        node.status = node.status === None ? All : None;
        updateParentNode(node.parent, map);
        updateChildrenNode(nodeName, map);
    });

    const strArr = [];
    for (let [key, value] of map) {
        strArr.push(`${'.'.repeat(value.index)}${translateStatus(value.status)}${key}`);
    }
    const res = strArr.join('\n');
    console.log(res);

    function translateStatus(symbol) {
        switch (symbol) {
            case All:
                return '[V]';
            case None:
                return '[ ]';
            case Partial:
                return '[o]';
        }
    }

    function updateParentNode(nodeName, map) {
        const node = map.get(nodeName);
        if (node && node.children) {
            const childrenStatus = Array.from(node.children, v => map.get(v).status);
            const newStatus = childrenStatus.every(status => status === All)
                ? All
                : childrenStatus.some(status => status !== None) ? Partial : None;
            // recursively update parent node when status gets changed
            if(newStatus !== node.status) {
                node.status = newStatus;
                updateParentNode(node.parent, map);
            }
        }
    }

    function updateChildrenNode(nodeName, map) {
        const node = map.get(nodeName);
        if (node && node.children) {
            node.children.forEach(child => {
                // update child node status using current node's status
                map.get(child).status = node.status;
                updateChildrenNode(child, map);
            });
        }
    }
}

treeSelect(paths, clicks);
