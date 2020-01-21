const fs = require("fs")
const path = require("path")
const yaml = require("js-yaml")

const configFileName = ".indexer.yaml"

const getFileDetails = fileName => {
  const stats = fs.lstatSync(fileName)
  const name = path.basename(fileName)
  const parsedName = name && name.split(".")
  let tags = {}
  for (const potentialTag of parsedName) {
    const parsedTag = potentialTag.split("-")
    // If potential tag element contains exactly one hyphen, then it's a tag
    if (parsedTag.length === 2) {
      tags[parsedTag[0]] = parsedTag[1]
    }
  }

  return {
    name,
    type: stats.isDirectory() ? "folder" : "file",
    tags
  }
}

const dirTree = folderName => {
  let index = []
  let deprecatedFiles = []

  if (fs.existsSync(`${folderName}/${configFileName}`)) {
    try {
      const config = yaml.safeLoad(
        fs.readFileSync(`${folderName}/${configFileName}`, "utf-8")
      )
      if (config.deprecatedFiles && config.deprecatedFiles.length > 0) {
        deprecatedFiles = config.deprecatedFiles
      }
    } catch (e) {
      console.log(`Failed to parse ${configFileName}`, e)
    }
  }

  const fileDetails = getFileDetails(folderName)
  if (fileDetails.type !== "folder") {
    // This should not happen! Error!
    throw "Expected a folder but received a file!"
  }

  fs.readdirSync(folderName).map(fileName => {
    const file = getFileDetails(`${folderName}/${fileName}`)
    const isDeprecatedFile = deprecatedFiles.indexOf(`${fileName}`) >= 0
    const isIgnoredFile = file.name === "index.json" || file.name[0] === "."
    if (!isIgnoredFile && !isDeprecatedFile) {
      index.push(file)
      if (file.type === "folder") {
        dirTree(`${folderName}/${fileName}`, deprecatedFiles)
      }
    }
  })

  fs.writeFile(
    `${folderName}/index.json`,
    JSON.stringify(index, null, 2),
    "utf8",
    () => {
      console.log(`Index written for ${folderName}`)
    }
  )

  return index
}

if (module.parent == undefined) {
  // node dirTree.js ~/foo/bar
  var util = require("util")
  console.log(util.inspect(dirTree(process.argv[2]), false, null))
}

module.exports = dirTree
