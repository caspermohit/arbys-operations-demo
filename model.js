export const slots = ['9–10 am','10–11 am','11 am–12 pm','12–1 pm','1–2 pm','2–3 pm','3–4 pm','4–5 pm','5–6 pm','6–7 pm','7–8 pm','8–9 pm','9–10 pm','10–11 pm'];
export const sum = values => values.reduce((a, b) => a + Number(b || 0), 0);
export const cents = value => Math.round((Number(value) + Number.EPSILON) * 100);
export function totals(day) {
 const sales = sum(day.rows.map(r => cents(r.sales))) / 100;
 const forecast = sum(day.rows.map(r => cents(r.forecast))) / 100;
 const hours = sum(day.rows.map(r => r.hours));
 return {sales, forecast, hours, customers:sum(day.rows.map(r => r.customers)), variance: Math.round((sales-forecast)*100)/100, spmh:hours ? sales/hours : null, percent:forecast ? (sales-forecast)/forecast*100 : null};
}
export function paidHours(shift) {
 const parse = t => {const [h,m] = t.split(':').map(Number); return h*60+m;};
 let duration = parse(shift.end)-parse(shift.start);
 if (duration < 0) duration += 1440;
 return Math.max(0,duration-Number(shift.break || 0))/60;
}
export function roastPlan(sales, perRoast, onHand, rounding='nearest') {
 if (!(perRoast > 0)) return {needed:null,cook:null};
 const needed = Math[rounding === 'up' ? 'ceil' : 'round'](sales/perRoast);
 return {needed,cook:Math.max(0,needed-Number(onHand || 0))};
}
export function sampleDay(date) {
 const tuesday=date==='2026-10-13';
 const forecast=tuesday?[0,99,337,643,448,199,136,257,278,312,266,99,121,44]:[0,54,243,467,332,279,134,256,313,310,188,207,74,20];
 const sales=tuesday?[0,62,348,701,373,352,119,249,493,257,55,150,33,69]:[0,56,311,160,244,159,207,334,330,204,199,143,65,13];
 const customers=tuesday?[0,4,24,36,25,19,9,13,23,12,5,9,2,3]:[0,2,14,9,8,12,9,16,13,9,8,6,2,1];
 const hours=tuesday?[2,2,3,4,2.5,3,2,2,4,3.5,3,3,2,4]:[3,3,3,3,1.5,2,2,2,3.5,4,3,3,2,4];
 return {date, rows:slots.map((slot,i)=>({forecast:forecast[i],sales:sales[i],customers:customers[i],hours:hours[i]})),allowed:tuesday?43:44,perRoast:tuesday?550:506, rounding:'nearest',shifts:[{name:'Opening crew',station:'Drive-through',start:tuesday?'09:00':'08:00',end:tuesday?'17:00':'14:00',break:30},{name:'Day manager',station:'Manager',start:'09:00',end:tuesday?'19:00':'18:00',break:0},{name:'Lunch crew A',station:tuesday?'Back line':'Front line',start:'12:00',end:tuesday?'15:00':'17:00',break:0},{name:'Lunch crew B',station:tuesday?'Front line':'Back line',start:'11:00',end:'14:00',break:0},{name:'Evening crew',station:'Front line',start:'17:00',end:'21:00',break:0},{name:'Closing crew',station:'Back line',start:'17:00',end:'23:30',break:30},{name:'Closing manager',station:'Manager',start:'18:00',end:'23:30',break:0}],roasts:[{time:'9 am',forecast:tuesday?2397:2078,onHand:tuesday?5:3},{time:'1 pm',forecast:tuesday?1896:1812,onHand:tuesday?0:2},{time:'3 pm',forecast:tuesday?1513:1408,onHand:0},{time:'5 pm',forecast:tuesday?1120:1112,onHand:0},{time:'Overnight',forecast:tuesday?1418:1726,onHand:tuesday?1:0}],checks:{},feedback:{works:'',changes:'',notes:''}};
}
export function blankDay(date) { const d=sampleDay(date);d.rows=d.rows.map(()=>({forecast:0,sales:0,customers:0,hours:0}));d.shifts=[];d.allowed=0;d.roasts=d.roasts.map(r=>({...r,forecast:0,onHand:0}));return d; }
// Timeline cells show scheduled presence; unpaid break timing is not provided.
export function shiftOverlap(shift, startMinute, endMinute) {
 const minutes = value => { const [h,m] = value.split(':').map(Number); return h*60+m; };
 const start=minutes(shift.start); let end=minutes(shift.end);
 if(end<start)end+=1440;
 return Math.max(0,Math.min(end,endMinute)-Math.max(start,startMinute));
}
