export interface MultipartFile {
    content: Buffer;
    filename: string;
    contentType: string;
    encoding: string;
    fieldName: string;
}
