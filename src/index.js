const fs = require("fs")
const path = require("path")

const getFileDetails = fileName => {
  const stats = fs.lstatSync(fileName)
  return {
    path: fileName,
    name: path.basename(fileName),
    type: stats.isDirectory() ? "folder" : "file"
  }
}

const dirTree = folderName => {
  let index = []

  const fileDetails = getFileDetails(folderName)
  if (fileDetails.type !== "folder") {
    // This should not happen! Error!
    throw "Expected a folder but received a file!"
  }

  fs.readdirSync(folderName).map(fileName => {
    const file = getFileDetails(`${folderName}/${fileName}`)
    if (file.name !== "index.json" && file.name[0] !== ".") {
      index.push(file)
      if (file.type === "folder") {
        dirTree(file.path)
      }
    }
  })

  fs.writeFile(`${folderName}/index.json`, JSON.stringify(index, null, 2), "utf8", () => {
    console.log(`Index written for ${folderName}`)
  })

  return index
}

if (module.parent == undefined) {
  // node dirTree.js ~/foo/bar
  var util = require("util")
  console.log(util.inspect(dirTree(process.argv[2]), false, null))
}

module.exports = dirTree
