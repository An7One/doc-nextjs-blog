import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "fakedata");

export function getSortedPostsData() {
  // to get file names under /fakedata
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // to remove ".md" from file name to extract ID
    const id = fileName.replace(/\.md$/, "");

    // to read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContent = fs.readFileSync(fullPath, "utf8");

    // to use gray-matter to parse the post metadata secion
    const matterResult = matter(fileContent);

    // to combine the data with the ID
    return {
      id,
      ...matterResult.data,
    };
  });

  return allPostsData.sort(({ date: a }, { date: b }) => {
    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    } else {
      return 0;
    }
  });
}
