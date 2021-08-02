import fs from "fs";
import html from "remark-html";
import path from "path";
import matter from "gray-matter";
import remark from "remark";

const postsDirectory = path.join(process.cwd(), "fakedata");

export const getSortedPostsData = () => {
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
      ...(matterResult.data as { date: string; title: string }),
    };
  });

  return allPostsData.sort((a, b) => {
    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    } else {
      return 0;
    }
  });
};

export const getAllPostIds = () => {
  const fileNames = fs.readdirSync(postsDirectory);

  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
};

export const getPostData = async (id: string) => {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContent = fs.readFileSync(fullPath, "utf8");

  // to use gray-matter to parse the post metadata section
  const matterResult = matter(fileContent);

  // to use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // to combine the data with the id
  return {
    id,
    contentHtml,
    ...(matterResult.data as { date: string; title: string }),
  };
};
