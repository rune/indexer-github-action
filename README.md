# indexer-github-action

Github action to automatically dump an index.json in every folder of a repository that lists all files inside it.

- Also adds "tags" to every file in the index by extracting information in the filename.
- Tags must be supplied in the filename using the following format: `.key-value.`
- For example, if there's a file called `landingImage.language-en.png`, it will be parsed as follows:

```json
{
  "name": "landingImage.language-en.png",
  "type": "file",
  "tags": { "language": "en" }
}
```

### References

- [Write github actions using NodeJS](https://datree.io/github-actions/)
