'use strict';
const chai = require('chai');
const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');
const apis = require('../dist/ccdir');

const { copy, clean } = apis;
const REL_TEMP = './test/temp';
const REL_DEST = './test/temp/dest';
const REL_SRC = './test/temp/src';
const TEMP = path.resolve(process.cwd(), REL_TEMP);
const DEST = path.resolve(process.cwd(), REL_DEST);
const SRC = path.resolve(process.cwd(), REL_SRC);

const sleep = (ms) => {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < ms);
};

describe('CCDir Test Suite', () => {
    before(() => {
        // create the temp directory and files before the first test in this block
        fs.mkdirSync(TEMP);
        fs.mkdirSync(SRC);
        fs.mkdirSync(DEST);
        const data = 'Some file data';
        const subDir = path.resolve(SRC, './test');
        const subDirDir = path.resolve(subDir, './test');
        const subFile = path.resolve(SRC, './txtFile.txt');
        const subDirFile = path.resolve(subDir, './txtFile.txt');
        fs.mkdirSync(subDir);
        fs.mkdirSync(subDirDir);
        fs.writeFileSync(subFile, data);
        fs.writeFileSync(subDirFile, data);
    });

    after(() => {
        // cleanup the temp directory and files after the last test in this block
        if (fs.existsSync(SRC)) {
            clean(REL_SRC);
            fs.rmdirSync(SRC);
        }
        if (fs.existsSync(DEST)) {
            clean(REL_DEST);
            fs.rmdirSync(DEST);
            fs.rmdirSync(TEMP);
        }
    });

    beforeEach(() => {
        clean(REL_DEST);
    });

    it('Should run test setup', () => {
        const result = 'Pass';
        expect(result).to.equal('Pass');
        expect(fs.existsSync(SRC)).to.equal(true);
        expect(fs.existsSync(DEST)).to.equal(true);
    });
    it('Should clean empty directory', () => {
        clean(REL_DEST);
        const list = fs.readdirSync(DEST);
        const fileCount = list ? list.length : 0;
        expect(fileCount).to.equal(0);
        expect(fs.existsSync(DEST)).to.equal(true);
    });
    it('Should report bad path from clean', () => expect(() => clean('./badpath').to.throw('Path does not exist!')));
    it('Should report bad source path from copy', () =>
        expect(() => copy('./badpath', DEST).to.throw('Path does not exist!')));
    it('Should report bad destination path from copy', () =>
        expect(() => copy(SRC, './badpath').to.throw('Path does not exist!')));
    it('Should clean relative subdirectory', () => {
        const data = 'Some file data';
        const subDir = path.resolve(DEST, './test');
        const subDirDir = path.resolve(subDir, './test');
        const subFile = path.resolve(DEST, './txtFile.txt');
        const subDirFile = path.resolve(subDir, './txtFile.txt');
        fs.mkdirSync(subDir);
        fs.mkdirSync(subDirDir);
        fs.writeFileSync(subFile, data);
        fs.writeFileSync(subDirFile, data);
        let list = fs.readdirSync(DEST);
        let fileCount = list ? list.length : 0;
        expect(fileCount).to.equal(2);
        clean(REL_DEST);
        list = fs.readdirSync(DEST);
        fileCount = list ? list.length : 0;
        expect(fileCount).to.equal(0);
        expect(fs.existsSync(DEST)).to.equal(true);
    });
    it('Should clean absolute subdirectory', () => {
        const data = 'Some file data';
        const subDir = path.resolve(DEST, './test');
        const subDirDir = path.resolve(subDir, './test');
        const subFile = path.resolve(DEST, './txtFile.txt');
        const subDirFile = path.resolve(subDir, './txtFile.txt');
        fs.mkdirSync(subDir);
        fs.mkdirSync(subDirDir);
        fs.writeFileSync(subFile, data);
        fs.writeFileSync(subDirFile, data);
        let list = fs.readdirSync(DEST);
        let fileCount = list ? list.length : 0;
        expect(fileCount).to.equal(2);
        clean(DEST);
        list = fs.readdirSync(DEST);
        fileCount = list ? list.length : 0;
        expect(fileCount).to.equal(0);
        expect(fs.existsSync(DEST)).to.equal(true);
    });
    it('Should copy an empty directory', () => {
        let list = fs.readdirSync(DEST);
        let fileCount = list ? list.length : 0;
        expect(fileCount).to.equal(0);
        const subDir = path.resolve(SRC, './empty');
        fs.mkdirSync(subDir);
        copy(REL_SRC + '/empty', DEST);
        list = fs.readdirSync(DEST);
        fileCount = list ? list.length : 0;
        expect(fileCount).to.equal(1);
        const newDir = path.resolve(DEST, './empty');
        expect(fs.existsSync(newDir)).to.equal(true);
        list = fs.readdirSync(newDir);
        fileCount = list ? list.length : 0;
        expect(fileCount).to.equal(0);
        fs.rmdirSync(subDir);
    });
    it('Should copy relative path', () => {
        let list = fs.readdirSync(DEST);
        let fileCount = list ? list.length : 0;
        expect(fileCount).to.equal(0);
        copy(REL_SRC, REL_DEST);
        list = fs.readdirSync(DEST);
        fileCount = list ? list.length : 0;
        expect(fileCount).to.equal(1);
        let newDir = path.resolve(DEST, './src');
        expect(fs.existsSync(newDir)).to.equal(true);
        list = fs.readdirSync(newDir);
        fileCount = list ? list.length : 0;
        expect(fileCount).to.equal(2);
        newDir = path.resolve(newDir, './test');
        list = fs.readdirSync(newDir);
        fileCount = list ? list.length : 0;
        expect(fileCount).to.equal(2);
    });
    it('Should copy absolute from absolute path', () => {
        let list = fs.readdirSync(DEST);
        let fileCount = list ? list.length : 0;
        expect(fileCount).to.equal(0);
        copy(SRC, DEST);
        list = fs.readdirSync(DEST);
        fileCount = list ? list.length : 0;
        expect(fileCount).to.equal(1);
        let newDir = path.resolve(DEST, './src');
        expect(fs.existsSync(newDir)).to.equal(true);
        list = fs.readdirSync(newDir);
        fileCount = list ? list.length : 0;
        expect(fileCount).to.equal(2);
        newDir = path.resolve(newDir, './test');
        list = fs.readdirSync(newDir);
        fileCount = list ? list.length : 0;
        expect(fileCount).to.equal(2);
    });
});
