"use client";

import { FormEvent, FormEventHandler, useState } from "react";

function downloadFile(blob: Blob, name = "file.pdf") {
    const href = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), {
      href,
      style: "display:none",
      download: name,
    });
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(href);
    a.remove();
  }

export default function Admin() {
    const [error, setError] = useState("");
    async function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        const res = await fetch("/admin/report", {
            method: "POST",
            body: formData
        })
        if(!res.ok) {
            res.json().then(json => setError(json.error)).catch(e => setError(e));
            return;
        }
        const blob = await res.blob();
        downloadFile(blob, "report.csv");
    }

    return <>
    <h1>Admin Page</h1>
    <form onSubmit={submit} method="post">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" />
        <br />
        <button type="submit">Download</button>
    </form>
    {error && <div>Error: {error}</div>}
</>
}