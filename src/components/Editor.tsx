// import { tokenMethod } from '@/utils/token';
import JoditEditor from "jodit-react";
import React, { useMemo, useRef } from "react";
import { BASE_URL } from "../utils/env";

type Props = {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  onFocus?: (value: string) => void;
  className?: string;
  disabled?: boolean;
};

const Editor = (props: Props) => {
  const editor = useRef<any | null>(null);
  const { value, onChange, onBlur, className, disabled } = props;
  const config = useMemo(
    () => ({
      readonly: false,
      enableDragAndDropFileToEditor: true,
      placeholder: "Enter description...",
      uploader: {
        url: `${BASE_URL}/upload/single-file`,
        imagesExtensions: ["jpg", "png", "jpeg", "gif"],
        // headers: { Authorization: `Bearer ${tokenMethod?.get()?.accessToken}` },
        withCredentials: false,
        pathVariableName: "path",
        format: "json",
        method: "POST",
        prepareData: function (formData: any) {
          var file = formData.getAll("files[0]")[0];
          formData.append("file", file);

          formData.delete("files[0]");
          formData.delete("path");
          formData.delete("source");
          return formData;
        },
        isSuccess: function (res: any) {
          return !res.error;
        },
        getMessage: function (resp: any) {
          return resp.msgs.join("\n");
        },
        process: function (resp: any) {
          return {
            files: [resp.data],
            path: resp.data,
            baseurl: "",
            error: resp.error ? 1 : 0,
            msg: resp.msg,
          };
        },
        defaultHandlerSuccess(this: any, resp: any) {
          const j = this.j || this;
          const [tagName, attr]: string[] = ["img", "src"];
          const elm = j.createInside.element(tagName);
          elm.setAttribute(attr, resp.path);
          j.s.insertImage(elm as HTMLImageElement, null, null);
        },
      },
      // pasteFromWordActionList: 'INSERT_AS_HTML',
      // defaultActionOnPasteFromWord: 'insert_clear_html',
      // processPasteFromWord: true,
    }),
    []
  );
  return (
    <div className={`${className} cy-editor `}>
      {disabled ? (
        <div className="border border-solid border-black border-opacity-20 rounded-md p-2">
          <div
            className="product-description"
            dangerouslySetInnerHTML={{
              __html: value ?? "",
            }}
          />
        </div>
      ) : (
        <JoditEditor ref={editor} value={value ?? ""} onBlur={onBlur} config={config} onChange={onChange} />
      )}
    </div>
  );
};

export default React.memo(Editor);
