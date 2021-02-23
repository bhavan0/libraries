import * as XLSX from 'xlsx';
type multiDimension = any[][];
export default class XLXSExcelParser {

    static parse(file: any, sheetName: string[]) {
        // tslint:disable-next-line: no-shadowed-variable
        return new Promise((resolve) => {
            const reader = this.readFile(file);
            let parsedJsonData: multiDimension = [];
            reader.onload = (e: any) => {
                const parsedDictionary = new Map<string, multiDimension>();
                /* read workbook */
                /*For IE polyfill will send e as a binary itself*/
                const bstr: string = e.target ? e.target.result : e;
                const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary', cellDates: true });

                /* grab first sheet */
                // tslint:disable-next-line: prefer-for-of
                for (let i = 0; i < sheetName.length; i++) {
                    const ws: XLSX.WorkSheet = wb.Sheets[sheetName[i]];

                    /* save data */
                    parsedJsonData = ((XLSX.utils.sheet_to_json(ws, { header: 1 })) as multiDimension);
                    parsedDictionary.set(sheetName[i], parsedJsonData);
                }
                return resolve(parsedDictionary);
            };
        });
    }

    static parseFirstSheet(file: any) {
        // tslint:disable-next-line: no-shadowed-variable
        return new Promise((resolve, reject) => {
            const reader = this.readFile(file);
            reader.onload = (e: any) => {
                /* read workbook */
                /*For IE polyfill will send e as a binary itself*/
                const bstr: string = e.target ? e.target.result : e;
                const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary', cellDates: true });

                /* grab first sheet */
                const ws: XLSX.WorkSheet = wb.Sheets[wb.SheetNames[0]];
                const parsedJsonData = ((XLSX.utils.sheet_to_json(ws, { header: 1 })) as multiDimension);
                return resolve(parsedJsonData);
            };
        });
    }

    private static readFile(file: any): FileReader {
        /* wire up file reader */
        const target: DataTransfer = (file.target) as DataTransfer;
        if (target.files.length !== 1) { throw new Error('Cannot use multiple files'); }
        const reader: FileReader = new FileReader();
        reader.readAsBinaryString(target.files[0]);

        return reader;
    }

}


// Usage
//
// return await XLXSExcelParser.parse(file, [SHEET_NAME as string])
//             .then((parsedData: any) => {
//                 const parsedSheet = parsedData.get(SHEET_NAME as string);
//             });
//
