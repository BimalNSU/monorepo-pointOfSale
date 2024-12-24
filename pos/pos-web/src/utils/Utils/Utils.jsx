// // this will go to util
// const error = (text) => {

// this will go to util
import { query, getDocs, where } from "firebase/firestore";

import { message, Spin, Modal, Row, Tag } from "antd";
import moment from "moment";
import { ExclamationCircleOutlined } from "@ant-design/icons";
export const toPascalCase = (s) => {
  return s.replace(/(\w)(\w*)/g, function (g0, g1, g2) {
    return g1.toUpperCase() + g2.toLowerCase();
  });
};

// customSort(): priority: alphabat > numeric
export const customSort = (arr, dataIndex) => {
  const pattern = /^\d+/i;
  return arr.sort((cur, next) => {
    const a = cur[dataIndex].toLowerCase();
    const b = next[dataIndex].toLowerCase();
    const numOfA = a.match(pattern);
    const numOfB = b.match(pattern);
    //when both of them r non-numeric
    if (numOfA == null && numOfB == null) {
      //increasing order
      return a > b ? 1 : a < b ? -1 : 0;
    } else if (numOfA == null) {
      return -1;
    } else if (numOfB == null) {
      return 1;
    } else {
      //numeric value sort section(increasing order)
      const n1 = parseInt(numOfA[0]);
      const n2 = parseInt(numOfB[0]);
      if (n1 > n2) {
        return 1;
      } else if (n1 < n2) {
        return -1;
      } else {
        //when both r identical prefix numerical value
        return a > b ? 1 : a < b ? -1 : 0;
      }
    }
  });
};
export const error = (data) => {
  message.error(data);
};
export const loginError = (data) => {
  Modal.error({
    icon: <ExclamationCircleOutlined />,
    content: (
      <Row justify="center">
        <Tag color="error">{data}</Tag>
      </Row>
    ),
    onOk() {
      // console.log("OK");
    },
    // onCancel() {
    //   console.log("Cancel");
    // },
  });
};
export const success = (data) => {
  message.success(data);
  // Modal.success({
  //     content: data,
  // })
};
export const dateFormatForFirebase = (date, format) => {
  return moment(date).format(format).toString();
};

export const checkValueExist = async (ref, fieldName, fieldValue) => {
  const q = query(ref, where(fieldName, "==", fieldValue), where("isDeleted", "==", false));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    return true;
  }
};

// / delete the undefined properties
export const deleteUndefinedFromObj = (obj) => {
  // for (let prop in obj) {
  //     if (!obj[prop]) {
  //         delete obj[prop]
  //     }
  // }
  Object.keys(obj).forEach((key) => (obj[key] === undefined ? delete obj[key] : {}));
  Object.keys(obj).forEach((key) => (typeof obj[key] === "function" ? delete obj[key] : {}));
};

export const deleteUndefinedNullFromObj = (obj) => {
  // for (let prop in obj) {
  //     if (!obj[prop]) {
  //         delete obj[prop]
  //     }
  // }
  Object.keys(obj).forEach((key) =>
    obj[key] === undefined || obj[key] === null ? delete obj[key] : {},
  );
  Object.keys(obj).forEach((key) => (typeof obj[key] === "function" ? delete obj[key] : {}));
};

export const loading = (status) => {
  if (status === "loading") {
    return (
      <div className={`spin`}>
        <Spin size="large" />
      </div>
    );
  }
};

export const checkUserInputType = (loginWith) => {
  const emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  const bdMobilePattern = /^01[3,5-9]\d{8}$/;
  if (emailPattern.test(loginWith)) {
    return "email";
  } else if (bdMobilePattern.test(loginWith)) {
    return "mobile";
  } else {
    return "uid";
  }
};

export const shallowEqualUnordered = (o1, o2) => {
  if (o1 instanceof Array && o2 instanceof Array) {
    if (o1.length !== o2.length) return false;
    const no1 = [...o1];
    const no2 = [...o2];
    no1.sort();
    no2.sort();
    for (let i = 0; i < no1.length; i++) {
      if (no1[i] !== no2[i]) {
        return false;
      }
    }
  } else if (o1 instanceof Object && o2 instanceof Object) {
    if (Object.keys(o1).length !== Object.keys(o2).length) return false;
    Object.keys(o1).forEach((k) => {
      if (o1[k] !== o2[k]) {
        return false;
      }
    });
  } else if (typeof o1 !== typeof o2) {
    return false;
  } else {
    return o1 === o2;
  }
};

export const deepCopy = (o) => {
  if (o instanceof Array) {
    return [...o.map(deepCopy)];
  } else if (o instanceof Object) {
    const res = {};
    Object.entries(o).forEach(([k, v]) => {
      res[k] = deepCopy(v);
    });
    return res;
  } else {
    return o;
  }
};

export const getFirestoreDiff = (cur, prev) => {
  if (
    !(cur instanceof Object) ||
    cur instanceof Array ||
    !(prev instanceof Object) ||
    prev instanceof Array
  ) {
    throw Error("Inapplicable types");
  }
  const ncur = {};
  const arrayRemoves = {};
  const arrayAdds = {};
  Object.keys(cur).forEach((k) => {
    if (prev[k] == undefined && cur[k]) {
      ncur[k] = deepCopy(cur[k]);
    } else if (prev[k] instanceof Array && cur[k] instanceof Array) {
      arrayAdds[k] = [];
      arrayRemoves[k] = [];
      const curArr = [...cur[k]];
      const prevArr = [...prev[k]];
      curArr.forEach((item) => {
        if (!prevArr.includes(item)) {
          arrayAdds[k].push(item);
        }
      });
      prevArr.forEach((item) => {
        if (!curArr.includes(item)) {
          arrayRemoves[k].push(item);
        }
      });
      if (arrayAdds[k].length === 0) {
        delete arrayAdds[k];
      }
      if (arrayRemoves[k].length === 0) {
        delete arrayRemoves[k];
      }
    } else if (prev[k] instanceof Object && cur[k] instanceof Object) {
      // assuming object keys will not be deleted
      Object.keys(cur[k]).forEach((k2) => {
        if (!shallowEqualUnordered(cur[k][k2], prev[k][k2])) {
          ncur[`${k}.${k2}`] = deepCopy(cur[k][k2]);
        }
      });
    } else if (cur[k] !== prev[k]) {
      // should be primitive at this point
      ncur[k] = cur[k];
    }
  });
  return {
    newObj: ncur,
    arrayAdds,
    arrayRemoves,
  };
};

export const getWindowSize = () => {
  const { innerWidth, innerHeight } = window;
  return { innerWidth, innerHeight };
};

export const addSeconds = (date, seconds) => {
  date.setSeconds(date.getSeconds() + seconds);
  return date;
};
export function capitalize(word) {
  const lower = word.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

export const generateAlphanumeric = (length) => {
  let result = "";
  const lowerCharacters = "abcdefghijklmnopqrstuvwxyz";
  const upperCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numericCharacters = "0123456789";
  const numberOfType = 3;
  let counter = 0;
  while (counter < length) {
    const type = Math.floor(Math.random() * numberOfType);
    switch (type) {
      case 0:
        result += lowerCharacters.charAt(Math.floor(Math.random() * 26));
        break;
      case 1:
        result += upperCharacters.charAt(Math.floor(Math.random() * 26));
        break;
      case 2:
        result += numericCharacters.charAt(Math.floor(Math.random() * 10));
        break;
      default:
        "";
        break;
    }
    counter += 1;
  }
  return result;
};
export const toEn = (n) => n.replace(/[০-৯]/g, (d) => "০১২৩৪৫৬৭৮৯".indexOf(d));
export const toBn = (n) => n.replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);
