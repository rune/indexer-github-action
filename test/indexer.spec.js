const indexer = require("../src/index.js")
const fs = require("fs-extra")
const expect = require("chai").expect

describe("Indexer Tests", () => {
  before(done => {
    console.log("Resetting 'testFolder' to 'templateFolder'")
    try {
      fs.emptyDirSync("test/testFolder")
      fs.copySync("test/templateFolder", "test/testFolder")
      indexer("test/testFolder")
      done()
    } catch (err) {
      console.log(err)
      throw err
    }
  })

  it("Should create 5 index.json files", done => {
    expect(fs.existsSync("test/testFolder/index.json"))
    expect(fs.existsSync("test/testFolder/b/index.json"))
    expect(fs.existsSync("test/testFolder/b/c/index.json"))
    expect(fs.existsSync("test/testFolder/b/d/index.json"))
    expect(fs.existsSync("test/testFolder/img/index.json"))
    done()
  })

  it("Should create JSON files with the correct filenames", done => {
    const d = JSON.parse(fs.readFileSync("test/testFolder/b/d/index.json"))
    expect(d[1].name).to.equal("d2.json")
    done()
  })

  it("Should ignore folders that begin with a dot", done => {
    expect(!fs.existsSync("test/testFolder/.shouldIgnore/index.json"))
    done()
  })

  it("Should ignore files that start with a dot", done => {
    const c = JSON.parse(fs.readFileSync("test/testFolder/b/c/index.json"))
    expect(c.length).to.equal(2)
    done()
  })

  it("Should ignore deprecated files and folders", done => {
    const a = JSON.parse(fs.readFileSync("test/testFolder/index.json"))
    expect(a.length).to.equal(6)
    const y = JSON.parse(fs.readFileSync("test/testFolder/y/index.json"))
    expect(y.length).to.equal(1)
    done()
  })

  it("Should parse tags in filenames", done => {
    const a = JSON.parse(fs.readFileSync("test/testFolder/index.json"))
    expect(a[4].tags.tagKey).to.equal("tagValue")
    done()
  })

  it("Should ignore responsive 2x and 3x images", done => {
    const img = JSON.parse(fs.readFileSync("test/testFolder/img/index.json"))
    expect(img.length).to.equal(2)
    done()
  })

  it("Should throw if responsive images are not present", done => {
    try {
      fs.emptyDirSync("test/testFolder2")
      fs.copySync("test/templateFolder2", "test/testFolder2")
      indexer("test/testFolder2")
    } catch (err) {
      expect(err.msg).to.contain("2x image not present")
      done()
    }
  })
})
