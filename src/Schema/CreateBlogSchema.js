import {zod} from "zod"

export const CreateBlogSchema = zod.object({
    title: zod.string().min(1, "Title is required"),
    content: zod.string().min(1, "Content is required"),
    image: zod.string().min(1, "Image is required").url("Invalid image URL"),
    category: zod.string().min(1, "Category is required"),
    status: zod.enum(["draft", "published"], {
        required_error: "Status is required",
        invalid_type_error: "Status is required",
    }),
})