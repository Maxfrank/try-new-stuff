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
  paths.sort();
  const map = new Map();
  paths.forEach(path => {
    path.split('/').forEach((val, i, arr) => {
      if(!map.has(val)) {
        map.set(val, {parent: i === 0 ? null : arr[i-1], children: i === arr.length - 1 ? null : new Set(arr[i+1]), status: None, index: i});
      } else {
        const node = map.get(val);
        if(node.children) {
          node.children.add(arr[i+1]);
        }
      }
    });
  });
  clicks.forEach(nodeName => {
    const node = map.get(nodeName);
    node.status = node.status === None ? All : None;
    handleClick(nodeName, map);
  });

  const strArr = [];
  for(let [key, value] of map) {
    strArr.push(`${'.'.repeat(value.index)}${convertStatus(value.status)}${key}`);
  }
  const res = strArr.join('\n');
  console.log(res);

  function convertStatus(symbol) {
    switch(symbol) {
      case All:
        return '[V]';
      case None:
        return '[ ]';
      case Partial:
        return '[o]';
    }
  }

  function handleClick(nodeName, map, direction) {
    const node = map.get(nodeName);
    if(node.parent && direction !== 'down') {
      updateParentStatus(node.parent, map);
      handleClick(node.parent, map, 'up');
    }
    if(node.children && direction !== 'up') {
      node.children.forEach(child => {
        updateChildrenStatus(child, map, node.status);
        handleClick(child, map, 'down');
      });
    }
  }

  function updateParentStatus(nodeName, map) {
    const node = map.get(nodeName);
    if(node.children) {
      const childrenStatus = Array.from(node.children, v=> map.get(v).status);
      node.status = childrenStatus.every(status => status === All)
        ? All
        : childrenStatus.some(status => status !== None) ? Partial : None;
    }
  }

  function updateChildrenStatus(nodeName, map, status) {
    const node = map.get(nodeName);
    if(status) {
      node.status = status;
    }
  }
}

treeSelect(paths, clicks);
