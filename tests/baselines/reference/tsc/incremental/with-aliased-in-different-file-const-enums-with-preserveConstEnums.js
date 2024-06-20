currentDirectory:: / useCaseSensitiveFileNames: false
Input::
//// [/lib/lib.d.ts]
/// <reference no-default-lib="true"/>
interface Boolean {}
interface Function {}
interface CallableFunction {}
interface NewableFunction {}
interface IArguments {}
interface Number { toExponential: any; }
interface Object {}
interface RegExp {}
interface String { charAt: any; }
interface Array<T> { length: number; [n: number]: T; }
interface ReadonlyArray<T> {}
declare const console: { log(msg: any): void; };

//// [/src/project/a.ts]
import {A} from "./c"
let a = A.ONE


//// [/src/project/b.d.ts]
export { AWorker as A } from "./worker";


//// [/src/project/c.ts]
import {A} from "./b"
let b = A.ONE
export {A}


//// [/src/project/worker.d.ts]
export const enum AWorker {
    ONE = 1
}




Output::
/lib/tsc -i /src/project/a.ts --tsbuildinfofile /src/project/a.tsbuildinfo --preserveConstEnums
exitCode:: ExitStatus.Success


//// [/src/project/a.js]
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var a = 1 /* A.ONE */;


//// [/src/project/a.tsbuildinfo]
{"fileNames":["../../lib/lib.d.ts","./worker.d.ts","./b.d.ts","./c.ts","./a.ts"],"fileIdsList":[[4],[2],[3]],"fileInfos":[{"version":"3858781397-/// <reference no-default-lib=\"true\"/>\ninterface Boolean {}\ninterface Function {}\ninterface CallableFunction {}\ninterface NewableFunction {}\ninterface IArguments {}\ninterface Number { toExponential: any; }\ninterface Object {}\ninterface RegExp {}\ninterface String { charAt: any; }\ninterface Array<T> { length: number; [n: number]: T; }\ninterface ReadonlyArray<T> {}\ndeclare const console: { log(msg: any): void; };","affectsGlobalScope":true},"-10088995516-export const enum AWorker {\n    ONE = 1\n}\n","-6488945853-export { AWorker as A } from \"./worker\";\n","-3548623266-import {A} from \"./b\"\nlet b = A.ONE\nexport {A}\n","-5009241479-import {A} from \"./c\"\nlet a = A.ONE\n"],"root":[5],"options":{"preserveConstEnums":true,"tsBuildInfoFile":"./a.tsbuildinfo"},"referencedMap":[[5,1],[3,2],[4,3]],"version":"FakeTSVersion"}

//// [/src/project/a.tsbuildinfo.readable.baseline.txt]
{
  "fileNames": [
    "../../lib/lib.d.ts",
    "./worker.d.ts",
    "./b.d.ts",
    "./c.ts",
    "./a.ts"
  ],
  "fileIdsList": [
    [
      "./c.ts"
    ],
    [
      "./worker.d.ts"
    ],
    [
      "./b.d.ts"
    ]
  ],
  "fileInfos": {
    "../../lib/lib.d.ts": {
      "original": {
        "version": "3858781397-/// <reference no-default-lib=\"true\"/>\ninterface Boolean {}\ninterface Function {}\ninterface CallableFunction {}\ninterface NewableFunction {}\ninterface IArguments {}\ninterface Number { toExponential: any; }\ninterface Object {}\ninterface RegExp {}\ninterface String { charAt: any; }\ninterface Array<T> { length: number; [n: number]: T; }\ninterface ReadonlyArray<T> {}\ndeclare const console: { log(msg: any): void; };",
        "affectsGlobalScope": true
      },
      "version": "3858781397-/// <reference no-default-lib=\"true\"/>\ninterface Boolean {}\ninterface Function {}\ninterface CallableFunction {}\ninterface NewableFunction {}\ninterface IArguments {}\ninterface Number { toExponential: any; }\ninterface Object {}\ninterface RegExp {}\ninterface String { charAt: any; }\ninterface Array<T> { length: number; [n: number]: T; }\ninterface ReadonlyArray<T> {}\ndeclare const console: { log(msg: any): void; };",
      "signature": "3858781397-/// <reference no-default-lib=\"true\"/>\ninterface Boolean {}\ninterface Function {}\ninterface CallableFunction {}\ninterface NewableFunction {}\ninterface IArguments {}\ninterface Number { toExponential: any; }\ninterface Object {}\ninterface RegExp {}\ninterface String { charAt: any; }\ninterface Array<T> { length: number; [n: number]: T; }\ninterface ReadonlyArray<T> {}\ndeclare const console: { log(msg: any): void; };",
      "affectsGlobalScope": true
    },
    "./worker.d.ts": {
      "version": "-10088995516-export const enum AWorker {\n    ONE = 1\n}\n",
      "signature": "-10088995516-export const enum AWorker {\n    ONE = 1\n}\n"
    },
    "./b.d.ts": {
      "version": "-6488945853-export { AWorker as A } from \"./worker\";\n",
      "signature": "-6488945853-export { AWorker as A } from \"./worker\";\n"
    },
    "./c.ts": {
      "version": "-3548623266-import {A} from \"./b\"\nlet b = A.ONE\nexport {A}\n",
      "signature": "-3548623266-import {A} from \"./b\"\nlet b = A.ONE\nexport {A}\n"
    },
    "./a.ts": {
      "version": "-5009241479-import {A} from \"./c\"\nlet a = A.ONE\n",
      "signature": "-5009241479-import {A} from \"./c\"\nlet a = A.ONE\n"
    }
  },
  "root": [
    [
      5,
      "./a.ts"
    ]
  ],
  "options": {
    "preserveConstEnums": true,
    "tsBuildInfoFile": "./a.tsbuildinfo"
  },
  "referencedMap": {
    "./a.ts": [
      "./c.ts"
    ],
    "./b.d.ts": [
      "./worker.d.ts"
    ],
    "./c.ts": [
      "./b.d.ts"
    ]
  },
  "version": "FakeTSVersion",
  "size": 991
}

//// [/src/project/c.js]
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A = void 0;
var b_1 = require("./b");
Object.defineProperty(exports, "A", { enumerable: true, get: function () { return b_1.A; } });
var b = 1 /* A.ONE */;




Change:: change enum value
Input::
//// [/src/project/worker.d.ts]
export const enum AWorker {
    ONE = 2
}




Output::
/lib/tsc -i /src/project/a.ts --tsbuildinfofile /src/project/a.tsbuildinfo --preserveConstEnums
exitCode:: ExitStatus.Success


//// [/src/project/a.js]
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var a = 2 /* A.ONE */;


//// [/src/project/a.tsbuildinfo]
{"fileNames":["../../lib/lib.d.ts","./worker.d.ts","./b.d.ts","./c.ts","./a.ts"],"fileIdsList":[[4],[2],[3]],"fileInfos":[{"version":"3858781397-/// <reference no-default-lib=\"true\"/>\ninterface Boolean {}\ninterface Function {}\ninterface CallableFunction {}\ninterface NewableFunction {}\ninterface IArguments {}\ninterface Number { toExponential: any; }\ninterface Object {}\ninterface RegExp {}\ninterface String { charAt: any; }\ninterface Array<T> { length: number; [n: number]: T; }\ninterface ReadonlyArray<T> {}\ndeclare const console: { log(msg: any): void; };","affectsGlobalScope":true},"-10088959579-export const enum AWorker {\n    ONE = 2\n}\n","-6488945853-export { AWorker as A } from \"./worker\";\n","-3548623266-import {A} from \"./b\"\nlet b = A.ONE\nexport {A}\n","-5009241479-import {A} from \"./c\"\nlet a = A.ONE\n"],"root":[5],"options":{"preserveConstEnums":true,"tsBuildInfoFile":"./a.tsbuildinfo"},"referencedMap":[[5,1],[3,2],[4,3]],"version":"FakeTSVersion"}

//// [/src/project/a.tsbuildinfo.readable.baseline.txt]
{
  "fileNames": [
    "../../lib/lib.d.ts",
    "./worker.d.ts",
    "./b.d.ts",
    "./c.ts",
    "./a.ts"
  ],
  "fileIdsList": [
    [
      "./c.ts"
    ],
    [
      "./worker.d.ts"
    ],
    [
      "./b.d.ts"
    ]
  ],
  "fileInfos": {
    "../../lib/lib.d.ts": {
      "original": {
        "version": "3858781397-/// <reference no-default-lib=\"true\"/>\ninterface Boolean {}\ninterface Function {}\ninterface CallableFunction {}\ninterface NewableFunction {}\ninterface IArguments {}\ninterface Number { toExponential: any; }\ninterface Object {}\ninterface RegExp {}\ninterface String { charAt: any; }\ninterface Array<T> { length: number; [n: number]: T; }\ninterface ReadonlyArray<T> {}\ndeclare const console: { log(msg: any): void; };",
        "affectsGlobalScope": true
      },
      "version": "3858781397-/// <reference no-default-lib=\"true\"/>\ninterface Boolean {}\ninterface Function {}\ninterface CallableFunction {}\ninterface NewableFunction {}\ninterface IArguments {}\ninterface Number { toExponential: any; }\ninterface Object {}\ninterface RegExp {}\ninterface String { charAt: any; }\ninterface Array<T> { length: number; [n: number]: T; }\ninterface ReadonlyArray<T> {}\ndeclare const console: { log(msg: any): void; };",
      "signature": "3858781397-/// <reference no-default-lib=\"true\"/>\ninterface Boolean {}\ninterface Function {}\ninterface CallableFunction {}\ninterface NewableFunction {}\ninterface IArguments {}\ninterface Number { toExponential: any; }\ninterface Object {}\ninterface RegExp {}\ninterface String { charAt: any; }\ninterface Array<T> { length: number; [n: number]: T; }\ninterface ReadonlyArray<T> {}\ndeclare const console: { log(msg: any): void; };",
      "affectsGlobalScope": true
    },
    "./worker.d.ts": {
      "version": "-10088959579-export const enum AWorker {\n    ONE = 2\n}\n",
      "signature": "-10088959579-export const enum AWorker {\n    ONE = 2\n}\n"
    },
    "./b.d.ts": {
      "version": "-6488945853-export { AWorker as A } from \"./worker\";\n",
      "signature": "-6488945853-export { AWorker as A } from \"./worker\";\n"
    },
    "./c.ts": {
      "version": "-3548623266-import {A} from \"./b\"\nlet b = A.ONE\nexport {A}\n",
      "signature": "-3548623266-import {A} from \"./b\"\nlet b = A.ONE\nexport {A}\n"
    },
    "./a.ts": {
      "version": "-5009241479-import {A} from \"./c\"\nlet a = A.ONE\n",
      "signature": "-5009241479-import {A} from \"./c\"\nlet a = A.ONE\n"
    }
  },
  "root": [
    [
      5,
      "./a.ts"
    ]
  ],
  "options": {
    "preserveConstEnums": true,
    "tsBuildInfoFile": "./a.tsbuildinfo"
  },
  "referencedMap": {
    "./a.ts": [
      "./c.ts"
    ],
    "./b.d.ts": [
      "./worker.d.ts"
    ],
    "./c.ts": [
      "./b.d.ts"
    ]
  },
  "version": "FakeTSVersion",
  "size": 991
}

//// [/src/project/c.js]
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A = void 0;
var b_1 = require("./b");
Object.defineProperty(exports, "A", { enumerable: true, get: function () { return b_1.A; } });
var b = 2 /* A.ONE */;




Change:: change enum value again
Input::
//// [/src/project/worker.d.ts]
export const enum AWorker {
    ONE = 3
}




Output::
/lib/tsc -i /src/project/a.ts --tsbuildinfofile /src/project/a.tsbuildinfo --preserveConstEnums
exitCode:: ExitStatus.Success


//// [/src/project/a.js]
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var a = 3 /* A.ONE */;


//// [/src/project/a.tsbuildinfo]
{"fileNames":["../../lib/lib.d.ts","./worker.d.ts","./b.d.ts","./c.ts","./a.ts"],"fileIdsList":[[4],[2],[3]],"fileInfos":[{"version":"3858781397-/// <reference no-default-lib=\"true\"/>\ninterface Boolean {}\ninterface Function {}\ninterface CallableFunction {}\ninterface NewableFunction {}\ninterface IArguments {}\ninterface Number { toExponential: any; }\ninterface Object {}\ninterface RegExp {}\ninterface String { charAt: any; }\ninterface Array<T> { length: number; [n: number]: T; }\ninterface ReadonlyArray<T> {}\ndeclare const console: { log(msg: any): void; };","affectsGlobalScope":true},"-10088923642-export const enum AWorker {\n    ONE = 3\n}\n","-6488945853-export { AWorker as A } from \"./worker\";\n","-3548623266-import {A} from \"./b\"\nlet b = A.ONE\nexport {A}\n","-5009241479-import {A} from \"./c\"\nlet a = A.ONE\n"],"root":[5],"options":{"preserveConstEnums":true,"tsBuildInfoFile":"./a.tsbuildinfo"},"referencedMap":[[5,1],[3,2],[4,3]],"version":"FakeTSVersion"}

//// [/src/project/a.tsbuildinfo.readable.baseline.txt]
{
  "fileNames": [
    "../../lib/lib.d.ts",
    "./worker.d.ts",
    "./b.d.ts",
    "./c.ts",
    "./a.ts"
  ],
  "fileIdsList": [
    [
      "./c.ts"
    ],
    [
      "./worker.d.ts"
    ],
    [
      "./b.d.ts"
    ]
  ],
  "fileInfos": {
    "../../lib/lib.d.ts": {
      "original": {
        "version": "3858781397-/// <reference no-default-lib=\"true\"/>\ninterface Boolean {}\ninterface Function {}\ninterface CallableFunction {}\ninterface NewableFunction {}\ninterface IArguments {}\ninterface Number { toExponential: any; }\ninterface Object {}\ninterface RegExp {}\ninterface String { charAt: any; }\ninterface Array<T> { length: number; [n: number]: T; }\ninterface ReadonlyArray<T> {}\ndeclare const console: { log(msg: any): void; };",
        "affectsGlobalScope": true
      },
      "version": "3858781397-/// <reference no-default-lib=\"true\"/>\ninterface Boolean {}\ninterface Function {}\ninterface CallableFunction {}\ninterface NewableFunction {}\ninterface IArguments {}\ninterface Number { toExponential: any; }\ninterface Object {}\ninterface RegExp {}\ninterface String { charAt: any; }\ninterface Array<T> { length: number; [n: number]: T; }\ninterface ReadonlyArray<T> {}\ndeclare const console: { log(msg: any): void; };",
      "signature": "3858781397-/// <reference no-default-lib=\"true\"/>\ninterface Boolean {}\ninterface Function {}\ninterface CallableFunction {}\ninterface NewableFunction {}\ninterface IArguments {}\ninterface Number { toExponential: any; }\ninterface Object {}\ninterface RegExp {}\ninterface String { charAt: any; }\ninterface Array<T> { length: number; [n: number]: T; }\ninterface ReadonlyArray<T> {}\ndeclare const console: { log(msg: any): void; };",
      "affectsGlobalScope": true
    },
    "./worker.d.ts": {
      "version": "-10088923642-export const enum AWorker {\n    ONE = 3\n}\n",
      "signature": "-10088923642-export const enum AWorker {\n    ONE = 3\n}\n"
    },
    "./b.d.ts": {
      "version": "-6488945853-export { AWorker as A } from \"./worker\";\n",
      "signature": "-6488945853-export { AWorker as A } from \"./worker\";\n"
    },
    "./c.ts": {
      "version": "-3548623266-import {A} from \"./b\"\nlet b = A.ONE\nexport {A}\n",
      "signature": "-3548623266-import {A} from \"./b\"\nlet b = A.ONE\nexport {A}\n"
    },
    "./a.ts": {
      "version": "-5009241479-import {A} from \"./c\"\nlet a = A.ONE\n",
      "signature": "-5009241479-import {A} from \"./c\"\nlet a = A.ONE\n"
    }
  },
  "root": [
    [
      5,
      "./a.ts"
    ]
  ],
  "options": {
    "preserveConstEnums": true,
    "tsBuildInfoFile": "./a.tsbuildinfo"
  },
  "referencedMap": {
    "./a.ts": [
      "./c.ts"
    ],
    "./b.d.ts": [
      "./worker.d.ts"
    ],
    "./c.ts": [
      "./b.d.ts"
    ]
  },
  "version": "FakeTSVersion",
  "size": 991
}

//// [/src/project/c.js]
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A = void 0;
var b_1 = require("./b");
Object.defineProperty(exports, "A", { enumerable: true, get: function () { return b_1.A; } });
var b = 3 /* A.ONE */;




Change:: something else changes in b.d.ts
Input::
//// [/src/project/b.d.ts]
export { AWorker as A } from "./worker";
export const randomThing = 10;



Output::
/lib/tsc -i /src/project/a.ts --tsbuildinfofile /src/project/a.tsbuildinfo --preserveConstEnums
exitCode:: ExitStatus.Success


//// [/src/project/a.js] file written with same contents
//// [/src/project/a.tsbuildinfo]
{"fileNames":["../../lib/lib.d.ts","./worker.d.ts","./b.d.ts","./c.ts","./a.ts"],"fileIdsList":[[4],[2],[3]],"fileInfos":[{"version":"3858781397-/// <reference no-default-lib=\"true\"/>\ninterface Boolean {}\ninterface Function {}\ninterface CallableFunction {}\ninterface NewableFunction {}\ninterface IArguments {}\ninterface Number { toExponential: any; }\ninterface Object {}\ninterface RegExp {}\ninterface String { charAt: any; }\ninterface Array<T> { length: number; [n: number]: T; }\ninterface ReadonlyArray<T> {}\ndeclare const console: { log(msg: any): void; };","affectsGlobalScope":true},"-10088923642-export const enum AWorker {\n    ONE = 3\n}\n","-7383473792-export { AWorker as A } from \"./worker\";\nexport const randomThing = 10;",{"version":"-3548623266-import {A} from \"./b\"\nlet b = A.ONE\nexport {A}\n","signature":"3259150197-import { A } from \"./b\";\nexport { A };\n"},{"version":"-5009241479-import {A} from \"./c\"\nlet a = A.ONE\n","signature":"-3531856636-export {};\n"}],"root":[5],"options":{"preserveConstEnums":true,"tsBuildInfoFile":"./a.tsbuildinfo"},"referencedMap":[[5,1],[3,2],[4,3]],"version":"FakeTSVersion"}

//// [/src/project/a.tsbuildinfo.readable.baseline.txt]
{
  "fileNames": [
    "../../lib/lib.d.ts",
    "./worker.d.ts",
    "./b.d.ts",
    "./c.ts",
    "./a.ts"
  ],
  "fileIdsList": [
    [
      "./c.ts"
    ],
    [
      "./worker.d.ts"
    ],
    [
      "./b.d.ts"
    ]
  ],
  "fileInfos": {
    "../../lib/lib.d.ts": {
      "original": {
        "version": "3858781397-/// <reference no-default-lib=\"true\"/>\ninterface Boolean {}\ninterface Function {}\ninterface CallableFunction {}\ninterface NewableFunction {}\ninterface IArguments {}\ninterface Number { toExponential: any; }\ninterface Object {}\ninterface RegExp {}\ninterface String { charAt: any; }\ninterface Array<T> { length: number; [n: number]: T; }\ninterface ReadonlyArray<T> {}\ndeclare const console: { log(msg: any): void; };",
        "affectsGlobalScope": true
      },
      "version": "3858781397-/// <reference no-default-lib=\"true\"/>\ninterface Boolean {}\ninterface Function {}\ninterface CallableFunction {}\ninterface NewableFunction {}\ninterface IArguments {}\ninterface Number { toExponential: any; }\ninterface Object {}\ninterface RegExp {}\ninterface String { charAt: any; }\ninterface Array<T> { length: number; [n: number]: T; }\ninterface ReadonlyArray<T> {}\ndeclare const console: { log(msg: any): void; };",
      "signature": "3858781397-/// <reference no-default-lib=\"true\"/>\ninterface Boolean {}\ninterface Function {}\ninterface CallableFunction {}\ninterface NewableFunction {}\ninterface IArguments {}\ninterface Number { toExponential: any; }\ninterface Object {}\ninterface RegExp {}\ninterface String { charAt: any; }\ninterface Array<T> { length: number; [n: number]: T; }\ninterface ReadonlyArray<T> {}\ndeclare const console: { log(msg: any): void; };",
      "affectsGlobalScope": true
    },
    "./worker.d.ts": {
      "version": "-10088923642-export const enum AWorker {\n    ONE = 3\n}\n",
      "signature": "-10088923642-export const enum AWorker {\n    ONE = 3\n}\n"
    },
    "./b.d.ts": {
      "version": "-7383473792-export { AWorker as A } from \"./worker\";\nexport const randomThing = 10;",
      "signature": "-7383473792-export { AWorker as A } from \"./worker\";\nexport const randomThing = 10;"
    },
    "./c.ts": {
      "original": {
        "version": "-3548623266-import {A} from \"./b\"\nlet b = A.ONE\nexport {A}\n",
        "signature": "3259150197-import { A } from \"./b\";\nexport { A };\n"
      },
      "version": "-3548623266-import {A} from \"./b\"\nlet b = A.ONE\nexport {A}\n",
      "signature": "3259150197-import { A } from \"./b\";\nexport { A };\n"
    },
    "./a.ts": {
      "original": {
        "version": "-5009241479-import {A} from \"./c\"\nlet a = A.ONE\n",
        "signature": "-3531856636-export {};\n"
      },
      "version": "-5009241479-import {A} from \"./c\"\nlet a = A.ONE\n",
      "signature": "-3531856636-export {};\n"
    }
  },
  "root": [
    [
      5,
      "./a.ts"
    ]
  ],
  "options": {
    "preserveConstEnums": true,
    "tsBuildInfoFile": "./a.tsbuildinfo"
  },
  "referencedMap": {
    "./a.ts": [
      "./c.ts"
    ],
    "./b.d.ts": [
      "./worker.d.ts"
    ],
    "./c.ts": [
      "./b.d.ts"
    ]
  },
  "version": "FakeTSVersion",
  "size": 1153
}

//// [/src/project/c.js] file written with same contents


Change:: something else changes in b.d.ts again
Input::
//// [/src/project/b.d.ts]
export { AWorker as A } from "./worker";
export const randomThing = 10;export const randomThing2 = 10;



Output::
/lib/tsc -i /src/project/a.ts --tsbuildinfofile /src/project/a.tsbuildinfo --preserveConstEnums
exitCode:: ExitStatus.Success


//// [/src/project/a.tsbuildinfo]
{"fileNames":["../../lib/lib.d.ts","./worker.d.ts","./b.d.ts","./c.ts","./a.ts"],"fileIdsList":[[4],[2],[3]],"fileInfos":[{"version":"3858781397-/// <reference no-default-lib=\"true\"/>\ninterface Boolean {}\ninterface Function {}\ninterface CallableFunction {}\ninterface NewableFunction {}\ninterface IArguments {}\ninterface Number { toExponential: any; }\ninterface Object {}\ninterface RegExp {}\ninterface String { charAt: any; }\ninterface Array<T> { length: number; [n: number]: T; }\ninterface ReadonlyArray<T> {}\ndeclare const console: { log(msg: any): void; };","affectsGlobalScope":true},"-10088923642-export const enum AWorker {\n    ONE = 3\n}\n","2191846063-export { AWorker as A } from \"./worker\";\nexport const randomThing = 10;export const randomThing2 = 10;",{"version":"-3548623266-import {A} from \"./b\"\nlet b = A.ONE\nexport {A}\n","signature":"3259150197-import { A } from \"./b\";\nexport { A };\n"},"-5009241479-import {A} from \"./c\"\nlet a = A.ONE\n"],"root":[5],"options":{"preserveConstEnums":true,"tsBuildInfoFile":"./a.tsbuildinfo"},"referencedMap":[[5,1],[3,2],[4,3]],"version":"FakeTSVersion"}

//// [/src/project/a.tsbuildinfo.readable.baseline.txt]
{
  "fileNames": [
    "../../lib/lib.d.ts",
    "./worker.d.ts",
    "./b.d.ts",
    "./c.ts",
    "./a.ts"
  ],
  "fileIdsList": [
    [
      "./c.ts"
    ],
    [
      "./worker.d.ts"
    ],
    [
      "./b.d.ts"
    ]
  ],
  "fileInfos": {
    "../../lib/lib.d.ts": {
      "original": {
        "version": "3858781397-/// <reference no-default-lib=\"true\"/>\ninterface Boolean {}\ninterface Function {}\ninterface CallableFunction {}\ninterface NewableFunction {}\ninterface IArguments {}\ninterface Number { toExponential: any; }\ninterface Object {}\ninterface RegExp {}\ninterface String { charAt: any; }\ninterface Array<T> { length: number; [n: number]: T; }\ninterface ReadonlyArray<T> {}\ndeclare const console: { log(msg: any): void; };",
        "affectsGlobalScope": true
      },
      "version": "3858781397-/// <reference no-default-lib=\"true\"/>\ninterface Boolean {}\ninterface Function {}\ninterface CallableFunction {}\ninterface NewableFunction {}\ninterface IArguments {}\ninterface Number { toExponential: any; }\ninterface Object {}\ninterface RegExp {}\ninterface String { charAt: any; }\ninterface Array<T> { length: number; [n: number]: T; }\ninterface ReadonlyArray<T> {}\ndeclare const console: { log(msg: any): void; };",
      "signature": "3858781397-/// <reference no-default-lib=\"true\"/>\ninterface Boolean {}\ninterface Function {}\ninterface CallableFunction {}\ninterface NewableFunction {}\ninterface IArguments {}\ninterface Number { toExponential: any; }\ninterface Object {}\ninterface RegExp {}\ninterface String { charAt: any; }\ninterface Array<T> { length: number; [n: number]: T; }\ninterface ReadonlyArray<T> {}\ndeclare const console: { log(msg: any): void; };",
      "affectsGlobalScope": true
    },
    "./worker.d.ts": {
      "version": "-10088923642-export const enum AWorker {\n    ONE = 3\n}\n",
      "signature": "-10088923642-export const enum AWorker {\n    ONE = 3\n}\n"
    },
    "./b.d.ts": {
      "version": "2191846063-export { AWorker as A } from \"./worker\";\nexport const randomThing = 10;export const randomThing2 = 10;",
      "signature": "2191846063-export { AWorker as A } from \"./worker\";\nexport const randomThing = 10;export const randomThing2 = 10;"
    },
    "./c.ts": {
      "original": {
        "version": "-3548623266-import {A} from \"./b\"\nlet b = A.ONE\nexport {A}\n",
        "signature": "3259150197-import { A } from \"./b\";\nexport { A };\n"
      },
      "version": "-3548623266-import {A} from \"./b\"\nlet b = A.ONE\nexport {A}\n",
      "signature": "3259150197-import { A } from \"./b\";\nexport { A };\n"
    },
    "./a.ts": {
      "version": "-5009241479-import {A} from \"./c\"\nlet a = A.ONE\n",
      "signature": "-5009241479-import {A} from \"./c\"\nlet a = A.ONE\n"
    }
  },
  "root": [
    [
      5,
      "./a.ts"
    ]
  ],
  "options": {
    "preserveConstEnums": true,
    "tsBuildInfoFile": "./a.tsbuildinfo"
  },
  "referencedMap": {
    "./a.ts": [
      "./c.ts"
    ],
    "./b.d.ts": [
      "./worker.d.ts"
    ],
    "./c.ts": [
      "./b.d.ts"
    ]
  },
  "version": "FakeTSVersion",
  "size": 1132
}

//// [/src/project/c.js] file written with same contents
