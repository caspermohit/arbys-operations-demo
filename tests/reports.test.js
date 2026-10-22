import test from 'node:test';
import assert from 'node:assert/strict';
import {renderReports} from '../reports.js';
import {sampleDay} from '../model.js';
test('full day prints two distinct worksheets and scope selects just one',()=>{const d=sampleDay('2026-10-13');assert.equal((renderReports(d).match(/class="rpt-sheet"/g)||[]).length,2);assert.equal((renderReports(d,'activity').match(/class="rpt-sheet"/g)||[]).length,1);assert.ok(!renderReports(d,'activity').includes('STAFF SCHEDULE / POSITION CHART'));assert.ok(!renderReports(d,'schedule').includes('class="rpt-activity"'));});
test('report uses current edits and escapes staff text',()=>{const d=sampleDay('2026-10-13');d.rows[0].sales=100;d.shifts[0].name='<img src=x onerror=alert(1)>';const html=renderReports(d);assert.ok(html.includes('$3361.00'));assert.ok(html.includes('&lt;img'));assert.ok(!html.includes('<img'));assert.ok(!html.includes('<input'));assert.ok(html.includes('Business date: 2026-10-13'));});
