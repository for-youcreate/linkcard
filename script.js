// ===============================
// ① 設定（祐政の情報に書き換える）
// ===============================
const GITHUB_USERNAME = "for-youcreate";   // ← 祐政の GitHub ユーザー名
const REPO_NAME = "linkcard";              // ← リポジトリ名
const TOKEN = "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";           // ← GitHub Token（絶対に公開しない）

// ===============================
// ② 保存ボタン
// ===============================
document.getElementById("saveBtn").addEventListener("click", async () => {
  const name = document.getElementById("name").value;
  const bio = document.getElementById("bio").value;
  const twitter = document.getElementById("twitter").value;

  // 画像（imgbb）
  const imageFile = document.getElementById("imageInput").files[0];
  let imageUrl = "";

  if (imageFile) {
    const formData = new FormData();
    formData.append("image", imageFile);

    const res = await fetch("https://api.imgbb.com/1/upload?key=YOUR_IMGBB_KEY", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    imageUrl = data.data.url;
  }

  // ===============================
  // ③ JSON データ作成
  // ===============================
  const uid = crypto.randomUUID();
  const profileData = {
    uid,
    name,
    bio,
    twitter,
    imageUrl
  };

  const jsonContent = JSON.stringify(profileData, null, 2);
  const encoded = btoa(unescape(encodeURIComponent(jsonContent)));

  // ===============================
  // ④ GitHub に JSON を保存
  // ===============================
  const apiUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/profiles/${uid}.json`;

  await fetch(apiUrl, {
    method: "PUT",
    headers: {
      "Authorization": `token ${TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "Add profile",
      content: encoded
    })
  });

  // ===============================
  // ⑤ プロフィールページへ移動
  // ===============================
  window.location.href = `profile.html?uid=${uid}`;
});
