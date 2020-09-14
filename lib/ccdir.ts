import * as fs from 'fs';
import * as path from 'path';

const { error, log } = console;

// new directory full path
let pathFromDestRoot: (path: string) => string;

/**
 * Deletes all contents from the specified directory
 * @param {*} dir
 */
export const clean = (dir: string) => {
    dir = replaceSep(dir);
    const clean_dir = path.resolve(process.cwd(), dir);
    if (fs.existsSync(clean_dir)) {
        _clean(dir, clean_dir, cleanCB);
    } else {
        throw new Error('Path does not exist!');
    }
};

/**
 * Copies the srcDir and all its contents into the outDir
 * @param {*} srcDir
 * @param {*} outDir
 */
export const copy = (srcDir: string, outDir: string) => {
    srcDir = replaceSep(srcDir);
    const newRootName = srcDir.substring(srcDir.lastIndexOf(path.sep), srcDir.length);
    outDir = replaceSep(outDir);
    outDir = path.resolve(process.cwd(), outDir);
    const src_dir = path.resolve(process.cwd(), srcDir);
    if (fs.existsSync(outDir) && fs.existsSync(src_dir)) {
        const out_root = path.resolve(outDir, '.' + newRootName);
        createDir(out_root);
        pathFromDestRoot = mapPath(out_root)(src_dir);
        _copy(srcDir, (err: Error | null, files: string[] | null) => {
            if (err) error(err);
        });
    } else {
        throw new Error('Path does not exist!');
    }
};

// deletes file or empty dir
const removeFile = (filePath: string) => {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};

const removeDir = (dir: string) => {
    if (fs.existsSync(dir)) {
        fs.rmdirSync(dir);
    }
};

/**
 * Creates a directory synchronously
 * @param dir
 */
const createDir = (dir: string) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        return true;
    }
    return false;
};
/**
 * Copies a file synchronously
 * @param src
 * @param dest
 */
const copyFile = (src: string, dest: string) => {
    fs.copyFileSync(src, dest, fs.constants.COPYFILE_EXCL);
    return 0;
};

//Recursively clean a dir
const _clean = (dir: string, clean_dir: string, cb: (e: Error | null, f: string[]) => void, files: string[] = []) => {
    const srcDir = path.resolve(process.cwd(), dir);
    let list = null;
    try {
        list = fs.readdirSync(srcDir);
    } catch (e) {
        return cb(e, []);
    }
    const fileCount = list ? list.length : 0;
    if (!fileCount) {
        if (clean_dir === srcDir) return cb(null, files);
        if (files.indexOf(srcDir) === -1) {
            removeDir(srcDir);
            files.push(srcDir);
        }
        return 0;
    }
    for (let i = 0; i < list.length; i++) {
        let Path = list[i];
        Path = path.resolve(srcDir, Path);
        try {
            const stat = fs.statSync(Path);
            if (stat && stat.isDirectory()) {
                _clean(Path, clean_dir, cleanCB, files);
            } else {
                removeFile(Path);
            }
        } catch (e) {
            continue;
        }
    }
    _clean(srcDir, clean_dir, cleanCB, files);
};

const _copy = (dir: string, cb: (e: Error | null, l: string[] | null) => void, files: string[] = []) => {
    const srcDir = path.resolve(process.cwd(), dir);
    let list = null;
    try {
        if (files.indexOf(srcDir) === -1) files.push(srcDir);
        list = fs.readdirSync(srcDir);
        createDir(pathFromDestRoot(srcDir));
    } catch (e) {
        return cb(e, []);
    }
    const fileCount = list ? list.length : 0;
    // if empty nothing to do and return
    if (!fileCount) return 0;

    list.forEach((Path) => {
        Path = path.resolve(srcDir, Path);
        try {
            const stat = fs.statSync(Path);
            if (stat && stat.isDirectory()) {
                _copy(
                    Path,
                    (err: Error | null, result: string[] | null) => {
                        if (err) throw err;
                    },
                    files,
                );
            } else {
                copyFile(Path, pathFromDestRoot(Path));
            }
        } catch (error) {
            return cb(error, null);
        }
    });
    return 0;
};

/**
 * creates the new destination paths for the source paths
 * @param {*} dest
 */
const mapPath = (dest: string) => (src_dir: string) => (filePath: string) =>
    `${dest}${path.sep}${filePath.substring(src_dir.length + 1, filePath.length)}`;

const cleanCB = (err: Error | null, dirList: string[]) => {
    if (err) {
        error(`Clean Error ${err.message}`);
    }
};

const replaceSep = (dir: string) => {
    if (path.sep.search(/\//) === 0) {
        return dir.replace(/\\/g, path.sep); // on Posix
    }
    return dir.replace(/\//g, path.sep); // on Win
};
