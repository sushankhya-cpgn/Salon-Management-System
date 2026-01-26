// export const timehelper = (startTime,endTime)=>{

//     const hour1 = String(startTime.getHours()).padStart(2,'0');
//     const hour2 =  String(endTime.getHours()).padStart(2,'0');
//     const minute1 = String(startTime.getMinutes()).padStart(2,'0');
//     const minute2 = String(endTime.getMinutes()).padStart(2,'0');
//     const second1 = String(startTime.getSeconds()).padStart(2,'0');
//     const second2 = String(endTime.getSeconds()).padStart(2,'0');
//     return[`${hour1}:${minute1}:${second1}`,`${hour2}:${minute2}:${second2}`];

// } 

export const formatTime = (d: Date) =>
  `${String(d.getHours()).padStart(2, "0")}:` +
  `${String(d.getMinutes()).padStart(2, "0")}:` +
  `${String(d.getSeconds()).padStart(2, "0")}`;
