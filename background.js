// Create a context menu item
browser.contextMenus.create({
  id: "add-to-tab-group",
  title: "Add Tab to Tab Group",
  contexts: ["page"],
});

// Helper function to create or retrieve the "Tab Group" folder
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

// Handle the context menu item click event
browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "add-to-tab-group") {
    // Get the current tab's URL and title
    const { url, title } = tab;

    // Get or create the "Tab Group" folder
    const tabGroupFolderId = await getOrCreateTabGroupFolder();

    // Bookmark the tab under the "Tab Group" folder
    await browser.bookmarks.create({
      parentId: tabGroupFolderId,
      title: title,
      url: url,
    });
  }
});
