const indexer = require("../src/index.js")
const fs = require("fs-extra")
const expect = require("chai").expect

describe("Indexer Tests", () => {
  before(done => {
    console.log("Resetting 'testFolder' to 'templateFolder'")
    try {
      fs.copySync("test/templateFolder", "test/testFolder")
      indexer("test/testFolder")
      done()
    } catch (err) {
      throw err
    }
  })

  it("Should create 4 index.json files", done => {
    expect(fs.existsSync("test/testFolder/index.json"))
    expect(fs.existsSync("test/testFolder/b/index.json"))
    expect(fs.existsSync("test/testFolder/b/c/index.json"))
    expect(fs.existsSync("test/testFolder/b/d/index.json"))
    done()
  })

  it("Should create JSON files with the correct filenames", done => {
    const d = JSON.parse(fs.readFileSync("test/testFolder/b/d/index.json"))
    expect(d[1].name).to.equal("d2.json")
    done()
  })
})
