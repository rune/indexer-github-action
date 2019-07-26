const indexer = require("../src/index.js")
const ncp = require("ncp").ncp

describe("Indexer Tests", () => {
  before(done => {
    console.log("Resetting 'testFolder' to 'templateFolder'")
    ncp("test/templateFolder", "test/testFolder", err => {
      if (err) {
        console.log("Error setting up folders to run tests!")
        console.error(err)
      } else {
        indexer("test/testFolder")
        done()
      }
    })
  })

  it("Should create three index.json files", done => {
    done()
  })

  it("Should create JSON files with the correct filenames", done => {
    done()
  })
})
