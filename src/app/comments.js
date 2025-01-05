

const id = "";
const secret = "";
const username = "";
const password = "";

const extractComments = (child, comments, more) => {
switch (child.kind) {
      case "t1":
        comments.push({
          body: child.data.body,
          author: child.data.author,
          id: child.data.id,
          parent_id: child.data.parent_id,
        });
        break;
      case "more":
        if (child.data.count > 0) {
          more.push(child.data.children);
        }
        break;
    }
  };
  
  const auth = async () => {
    const basicAuth = Buffer.from(`${id}:${secret}`).toString("base64");
  
    const params = new URLSearchParams();
    params.append("grant_type", "password");
    params.append("username", username);
    params.append("password", password);
  
    const res = await fetch("https://www.reddit.com/api/v1/access_token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
      },
      body: params,
    });
  
    const body = await res.json();
    return body.access_token;
  };
  
  const getPost = async (postId, access_token) => {
    const sort = "old";
    const threaded = false;
  
    const res = await fetch(
      `http://oauth.reddit.com/comments/${postId}?sort=${sort}&threaded=${threaded}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    const body = await res.json();
    const comments = [];
    const more = [];
  
    body[1].data.children.forEach((child) => {
      extractComments(child, comments, more);
    });
  
    return { comments, more };
  };
  
  const getMoreChildren = async (linkId, children, access_token) => {
    const res = await fetch(
      `http://oauth.reddit.com/api/morechildren?link_id=${linkId}&children=${children}&api_type=json`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
  
    const body = await res.json();
    const comments = [];
    const more = [];
  
    body.json.data.things.forEach((thing) => {
      extractComments(thing, comments, more);
    });
  
    return { comments, more };
  };
  
  export const getAllComments = async (postId) => {
    const token = await auth();
    const { comments, more } = await getPost(postId, token);
  
    while (more.length) {
      const current = more.shift();
      const selection = current.splice(0, 100); // NOTE: We can only query 100 at a time
      if (current.length) {
        more.push(current);
      }
      const { comments: moreComments, more: moreMore } = await getMoreChildren(
        `t3_${postId}`,
        selection.join(","),
        token
      );
      comments.push(...moreComments);
      if (moreMore.length) {
        more.push(moreMore);
      }
    }
  
    return comments;
  };
  