var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a;
var _this = this;
var Client = require("pg").Client;
var config = require("dotenv").config;
config({ path: "../../.env.development" });
config({ path: "../../.env.local" });
var client = new Client({
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: "localhost",
    database: "defaultdb",
    port: parseInt((_a = process.env.DB_PORT) !== null && _a !== void 0 ? _a : "5432", 10)
});
var resetDB = function () { return __awaiter(_this, void 0, void 0, function () {
    var e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, client.connect()];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, 7, , 8]);
                // language=PostgreSQL
                return [4 /*yield*/, client.query("begin transaction")
                    // language=PostgreSQL
                ];
            case 3:
                // language=PostgreSQL
                _a.sent();
                // language=PostgreSQL
                return [4 /*yield*/, client.query("\n      truncate table weekdays cascade;\n\n      truncate table image_to_students cascade;\n\n      truncate table student_to_classes cascade;\n\n      truncate table guardian_to_students cascade;\n\n      truncate table student_material_progresses cascade;\n\n      truncate table sessions cascade;\n\n      truncate table user_to_schools cascade;\n\n      truncate table attendances cascade;\n\n      truncate table password_reset_tokens cascade;\n\n      truncate table lesson_plan_links cascade;\n\n      truncate table observation_to_images cascade;\n\n      truncate table observations cascade;\n\n      truncate table guardians cascade;\n\n      truncate table file_to_lesson_plans cascade;\n\n      truncate table files cascade;\n\n      truncate table lesson_plan_to_students cascade;\n\n      truncate table students cascade;\n\n      truncate table images cascade;\n\n      truncate table lesson_plans cascade;\n\n      truncate table lesson_plan_details cascade;\n\n      truncate table materials cascade;\n\n      truncate table subjects cascade;\n\n      truncate table areas cascade;\n\n      truncate table classes cascade;\n\n      truncate table schools cascade;\n\n      truncate table curriculums cascade;\n\n      truncate table subscriptions cascade;\n\n      truncate table users cascade;\n  ")
                    // language=PostgreSQL
                ];
            case 4:
                // language=PostgreSQL
                _a.sent();
                // language=PostgreSQL
                return [4 /*yield*/, client.query("commit")];
            case 5:
                // language=PostgreSQL
                _a.sent();
                return [4 /*yield*/, client.end()];
            case 6:
                _a.sent();
                return [3 /*break*/, 8];
            case 7:
                e_1 = _a.sent();
                console.log(e_1);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
resetDB();
