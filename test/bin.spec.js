'use strict';
const chai = require('chai');
const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');
const bin = require('../dist/bin');

const REL_TEMP = './test/temp';
const REL_DEST = './test/temp/dest';
const REL_SRC = './test/temp/src';
const TEMP = path.resolve(process.cwd(), REL_TEMP);
const DEST = path.resolve(process.cwd(), REL_DEST);
const SRC = path.resolve(process.cwd(), REL_SRC);

describe('Bin Test Suite', () => {
    before(() => {
        // create the temp directory and files before the first test in this block
        fs.mkdirSync(TEMP);
        fs.mkdirSync(SRC);
        fs.mkdirSync(DEST);
    });
    after(() => {
        // cleanup the temp directory and files after the last test in this block
        if (fs.existsSync(SRC)) {
            bin.main('-cl', SRC);
            fs.rmdirSync(SRC);
        }
        if (fs.existsSync(DEST)) {
            bin.main('-cl', DEST);
            fs.rmdirSync(DEST);
            fs.rmdirSync(TEMP);
        }
    });
    it('Should run bin test setup', () => {
        const result = 'Pass';
        expect(result).to.equal('Pass');
        expect(fs.existsSync(process.cwd())).to.equal(true);
    });
    it('Should run clean', () => {
        let list = fs.readdirSync(DEST);
        let fileCount = list ? list.length : 0;
        expect(fileCount).to.equal(0);
        bin.main('-cl', DEST);
        list = fs.readdirSync(DEST);
        fileCount = list ? list.length : 0;
        expect(fileCount).to.equal(0);
        expect(fs.existsSync(DEST)).to.equal(true);
    });
    it('Should run copy', () => {
        const subDir = path.resolve(SRC, './test');
        fs.mkdirSync(subDir);
        let list = fs.readdirSync(DEST);
        let fileCount = list ? list.length : 0;
        expect(fileCount).to.equal(0);
        bin.main('-cp', SRC, DEST);
        list = fs.readdirSync(DEST);
        fileCount = list ? list.length : 0;
        expect(fileCount).to.equal(1);
    });
    it('Should run help', () => {
        expect(bin.main('--help')).to.equal(0);
        expect(bin.main('-h')).to.equal(0);
    });
});
