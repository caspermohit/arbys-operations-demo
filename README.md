# Shiftbook — restaurant operations prototype

A browser-local demo based on daily sales, labour, roast-preparation and staffing sheets. Static HTML, CSS and JavaScript; no build, backend, login or paid services.

## Run

`npm run dev` then open http://localhost:4173. Run calculation checks with `npm test`.

## Try it

October 12 and 13, 2026 contain sample sales entries transcribed from the supplied worksheets. Staff shifts use generic names and follow the printed times. Break deductions are inferred to reconcile to the printed scheduled totals (38 Monday, 39 Tuesday); the actual break policy needs confirmation. Other dates start blank. Edit hourly entries, add shifts, try roast assumptions, complete the checklist and download feedback. Data saves separately in each browser using localStorage; downloading a day exports JSON. Feedback is downloaded as text and must be sent back manually.

## Calculation contract

Sales aggregate in integer cents. SPMH uses unrounded cumulative sales divided by cumulative actual labour hours, displayed to two decimals. Forecast schedule SPMH divides the forecast by scheduled paid hours. Breaks are unpaid. Overnight shifts are supported; equal start/end times are zero. Scheduled and actual hours are independent.

The Monday hourly sales add to $2,425, while the printed cumulative total is $2,426. The prototype preserves the hourly entries and recalculates the total ($2,425), variance (-$452) and SPMH ($62.18). This source discrepancy is called out in the interface.

Sales forecasts and labour allowances are manual inputs. Roast forecasts are separately entered at each checkpoint because forecast windows are not established. Nearest-whole-roast rounding is an unverified default, with round-up available. Sales per roast is entered manually. Partial stock is allowed for review. These planning assumptions need manager approval before operational use. No POS, payroll, shared database, official audit trail or safety-compliance record is connected.

## Deployment

Serve this repository root through GitHub Pages (main branch, root folder). All assets use relative paths, so project Pages URLs work. No source scans, credentials or employee identities are included.
