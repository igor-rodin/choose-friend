export const utils = {
  MapToArray(map) {
    const result = [];
    map.forEach((val, key) => {
      result.push({
        id: key,
        full_name: val.full_name,
        photo: val.photo
      })
    });
    return result;
  },

  ArrToMap(arr) {
    const map = new Map();
    arr.forEach((val) => map.set(val.id, val))
    return map;
  }
}