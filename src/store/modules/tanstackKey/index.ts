import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const key = {
  role: "roles",
  account: "accounts",
  loaction: "locations",
  shop: "shops",
  product: "products",
  order: "orders",
};

type objKey = {
  role: string;
  account: string;
  loaction: string;
  shop: string;
  order: string;
  product: string;
};
type State = {
  key: objKey;
};

const initialState: State = {
  key,
};

const { actions, reducer: keyReducer } = createSlice({
  name: "key",
  initialState,
  reducers: {
    changeKey(state, action: PayloadAction<objKey>) {
      state.key = action.payload;
    },
    clear() {
      return { ...initialState, isInit: true };
    },
  },
});

const keyActions = { ...actions };

export { keyActions, keyReducer };

// - Vòng đời của 1 component
// mounting - update - unmount

// - Dữ liệu nhiều xử lý lâu
// Render lần lượt cái nào xong trc render ra trc

// - HOC 1 component nhân 1 component là đối số trả 1 về component
// sử dụng khi có nhiều component có logic giống nhau
// customehook sử dụng để custom loại 1 đoạn logic mà sử dụng nhiều lần ở nhiều nơi

// Dựng base tìm hiểu thư viên + yêu cầu khách hàng

// Next sử dụng rounter sẵn có

// getStaticProps - Hàm này được thực thi tại thời điểm build ứng dụng.
// được sử dụng để tìm nạp dữ liệu tại thời điểm xây dựng để tạo trang web tĩnh

// getServerSideProps - Hàm này được thực thi mỗi khi có một yêu cầu đến trang.
// callapi lấy về truyền dạng props về func

// getStaticPaths - slug
