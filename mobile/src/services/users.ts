import { uploadRequest } from "./api";
import { AuthUser } from "../types/auth";

export async function uploadAvatar(
    token: string,
    userId: string,
    uri: string,
): Promise<AuthUser> {
    const filename = uri.split("/").pop() ?? "avatar.jpg";
    const extMatch = /\.([a-zA-Z0-9]+)$/.exec(filename);
    const mimeType = extMatch ? `image/${extMatch[1]}` : "image";

    const formData = new FormData();
    formData.append(
        "file",
        {
            uri,
            name: filename,
            type: mimeType,
        } as unknown as Blob,
    );

    return uploadRequest<AuthUser>(`/users/${userId}/avatar`, {
        method: "PATCH",
        token,
        body: formData,
    });
}
