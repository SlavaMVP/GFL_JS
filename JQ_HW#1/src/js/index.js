$(() => {
  const $appEl = $("#app");
  const $listEl = $appEl.find(".js-comments-list");
  //const $commentTemplate = $("#comment-item-template");

  let commentItems = [];

  $(".js-fetch-btn").click(() => {
    $.ajax({
      url: "https://jsonplaceholder.typicode.com/comments?userId=3&postId=15",
      method: "GET",
    }).done(function (data) {
      commentItems = data.map((item) => {
        return {
          comment: item.name,
          id: item.id,
        };
      });

      render();
    });
  });

  function render() {
    let commentsList = commentItems
      .map((el, idx) => {
        return `
            <li class="js_todo_item" data-id="${el.id}">
            ${idx + 1}. ${el.comment}
            </li>`;
      })
      .join("");

    $listEl.html(commentsList);
  }
});
