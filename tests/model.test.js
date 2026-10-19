import test from 'node:test';
import assert from 'node:assert/strict';
import {totals,sampleDay,blankDay,paidHours,roastPlan} from '../model.js';
test('Tuesday scan reconciles to 3261 sales, 3239 forecast, 184 customers and 40 labour hours',()=>{const t=totals(sampleDay('2026-10-13'));assert.equal(t.sales,3261);assert.equal(t.forecast,3239);assert.equal(t.customers,184);assert.equal(t.hours,40);assert.equal(t.variance,22);assert.equal(t.spmh.toFixed(2),'81.53');});
test('Monday sums printed hourly entries and exposes the source total discrepancy',()=>{const t=totals(sampleDay('2026-10-12'));assert.equal(t.sales,2425);assert.equal(t.forecast,2877);assert.equal(t.customers,109);assert.equal(t.hours,39);assert.equal(t.variance,-452);assert.equal(t.spmh.toFixed(2),'62.18');});
test('currency adds in cents and zero denominators produce no misleading rate',()=>{let d=blankDay('2026-10-14');assert.equal(totals(d).spmh,null);assert.equal(totals(d).percent,null);d.rows[0].sales=.1;d.rows[1].sales=.2;assert.equal(totals(d).sales,.3);});
test('paid hours deduct unpaid breaks and handle midnight',()=>{assert.equal(paidHours({start:'09:00',end:'17:00',break:30}),7.5);assert.equal(paidHours({start:'18:00',end:'01:00',break:30}),6.5);assert.equal(paidHours({start:'09:00',end:'09:00',break:0}),0);});
test('roast assumptions are explicit, stock cannot create a negative cook',()=>{assert.deepEqual(roastPlan(2397,550,5),{needed:4,cook:0});assert.deepEqual(roastPlan(2397,550,0,'up'),{needed:5,cook:5});assert.deepEqual(roastPlan(1000,0,0),{needed:null,cook:null});assert.deepEqual(roastPlan(1650,550,1.5),{needed:3,cook:1.5});});

test('anonymous sample schedules match printed paid-hour totals',()=>{assert.equal(sampleDay('2026-10-12').shifts.reduce((n,s)=>n+paidHours(s),0),38);assert.equal(sampleDay('2026-10-13').shifts.reduce((n,s)=>n+paidHours(s),0),39);});

test('timeline shows half-hour shift spans and overnight overlap without inventing break timing',async()=>{const {shiftOverlap}=await import('../model.js');assert.equal(shiftOverlap({start:'09:30',end:'17:00'},540,570),0);assert.equal(shiftOverlap({start:'09:30',end:'17:00'},570,600),30);assert.equal(shiftOverlap({start:'18:00',end:'01:00'},1410,1440),30);assert.equal(shiftOverlap({start:'09:00',end:'09:00'},540,600),0);});
