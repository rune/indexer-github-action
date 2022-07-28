const fs = require("fs")
const path = require("path")
const yaml = require("js-yaml")

const configFileName = ".indexer.yaml"

const insertSuffix = (string, suffix) => {
  const indexOfDotBeforeFileExtension = string.lastIndexOf(".")
  return `${string.slice(
    0,
    indexOfDotBeforeFileExtension
  )}${suffix}${string.slice(indexOfDotBeforeFileExtension, string.length)}`
}

const getExtension = (string) => {
  const indexOfDotBeforeFileExtension = string.lastIndexOf(".")
  if (indexOfDotBeforeFileExtension < 0) {
    return "none"
  }
  return string.slice(indexOfDotBeforeFileExtension + 1, string.length)
}

const getFileDetails = (fileName) => {
  const stats = fs.lstatSync(fileName)
  const name = path.basename(fileName)
  const parsedName = name && name.split(".")
  let tags = {}
  // Skip 2x and 3x versions of images
  if (parsedName.length >= 3) {
    const suffix = parsedName[parsedName.length - 2]
    if (suffix === "2x" || suffix === "3x") {
      return {
        name,
        isResponsive: true,
      }
    }
  }
  for (const potentialTag of parsedName) {
    const parsedTag = potentialTag.split("-")
    // If potential tag element contains exactly one hyphen, then it's a tag
    if (parsedTag.length === 2) {
      tags[parsedTag[0]] = parsedTag[1]
    }
  }

  // Check if this is an image and then confirm that the 2x and 3x versions exist
  const fileExtension = getExtension(name)
  if (fileExtension === "jpg" || fileExtension === "png") {
    if (!fs.existsSync(insertSuffix(fileName, ".2x"))) {
      console.log("2x image not present", fileName)
      throw { msg: "2x image not present", fileName }
    }
    if (!fs.existsSync(insertSuffix(fileName, ".3x"))) {
      console.log("2x image not present", fileName)
      throw { msg: "3x image not present", fileName }
    }
  }

  return {
    name,
    type: stats.isDirectory() ? "folder" : "file",
    tags,
  }
}

const dirTree = (folderName) => {
  let index = []
  let deprecatedFiles = []

  if (fs.existsSync(`${folderName}/${configFileName}`)) {
    try {
      const config = yaml.load(
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

  fs.readdirSync(folderName)
    // TODO: Remove this .filter step once Rune Games are located on a different CDN
    .filter(
      (fileName) => `${folderName}/${fileName}` !== "/github/workspace/game"
    )
    .map((fileName) => {
      const isDeprecatedFile = deprecatedFiles.indexOf(`${fileName}`) >= 0
      const isIgnoredFile = fileName === "index.json" || fileName[0] === "."
      if (!isIgnoredFile && !isDeprecatedFile) {
        const file = getFileDetails(`${folderName}/${fileName}`)
        if (!file.isResponsive) {
          index.push(file)
          if (file.type === "folder") {
            dirTree(`${folderName}/${fileName}`, deprecatedFiles)
          }
        }
      }
    })

  fs.writeFile(
    `${folderName}/index.json`,
    JSON.stringify(index, null, 2),
    "utf8",
    (err) => {
      if (err) {
        console.err(`Index not written for ${folderName}`, err)
      } else {
        console.log(`Index written for ${folderName}`)
      }
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
