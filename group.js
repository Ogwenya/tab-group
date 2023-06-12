async function main() {
  // function to get the id of bookmark folder or create it if it does not exist
  async function getOrCreateTabGroupFolder() {
    // Check if the "Tab Group" folder already exists
    const existingFolders = await browser.bookmarks.search({
      title: "Tab Group",
    });
    if (existingFolders.length > 0) {
      // Return the ID of the existing folder

      return existingFolders[0].id;
    }

    // Create a new folder called "Tab Group"
    const createdFolder = await browser.bookmarks.create({
      parentId: "toolbar_____",
      title: "Tab Group",
    });

    // Return the ID of the newly created folder
    return createdFolder.id;
  }

  // Function to remove a bookmark
  async function removeBookmark(bookmarkId) {
    await browser.bookmarks.remove(bookmarkId);
    displayBookmarkList();
  }

  // get favicon images
  async function getFavicon(url) {
    const { hostname } = new URL(url);

    if (hostname) {
      const faviconURL = `https://www.google.com/s2/favicons?domain=${hostname}`;
      return faviconURL;
    } else {
      return null;
    }
  }

  // get the id of the bokmark folder
  const bookmarkiD = await getOrCreateTabGroupFolder();

  // display bookmarks
  async function displayBookmarkList() {
    const bookmarkList = document.getElementById("bookmark-list");

    // Clear the previous list
    bookmarkList.innerHTML = "";

    browser.bookmarks
      .getChildren(bookmarkiD) // Replace with the ID of the "Tab Group" folder
      .then(async (bookmarks) => {
        bookmarks.forEach(async (bookmark) => {
          const li = document.createElement("li");
          li.classList.add("bookmark-item");

          // create link container
          const linkContainer = document.createElement("div");
          linkContainer.classList.add("flex");

          const favicon = await getFavicon(bookmark.url);
          const faviconImage = document.createElement("img");
          faviconImage.classList.add("faviconImage");

          // display generic image if favicon is not available
          faviconImage.src = favicon || "/icons/link.svg";
          linkContainer.appendChild(faviconImage);

          const a = document.createElement("a");
          a.href = bookmark.url;
          a.textContent = bookmark.title;
          linkContainer.appendChild(a);

          // remove bookmark button
          const removeButton = document.createElement("span");
          removeButton.style.cursor = "pointer";
          removeButton.addEventListener("click", () => {
            removeBookmark(bookmark.id);
          });

          const svgImage = document.createElement("img");
          svgImage.src = "/icons/delete.svg";
          svgImage.style.width = "24px";
          svgImage.style.height = "24px";
          removeButton.appendChild(svgImage);

          li.appendChild(linkContainer);
          li.appendChild(removeButton);
          bookmarkList.appendChild(li);
        });
      });
  }

  displayBookmarkList();
}

main();
