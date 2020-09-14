import * as path from 'path';
import * as fs from 'fs';
import { clean, copy } from './lib/ccdir';
const temp = path.resolve(__dirname, './temp');
const test = path.resolve(__dirname, './temp/test');
fs.mkdirSync(temp);
fs.mkdirSync(test);
clean('../temp');
