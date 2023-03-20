export interface Todo {
  id: number;
  name: string;
  //  0: 待做， 1: 已完成， -1: 超时
  status: number;
}
