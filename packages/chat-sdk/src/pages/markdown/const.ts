export const markdown = `
# Code
as
\`\`\`javascript
$(document).ready(function () {
    alert('RUNOOB');
});
\`\`\`
https://www.coze.com
test@coze.com
[coze](javascripdt://www.baidu.com)
![Alt Text](https://pic1.zhimg.com/v2-b444070848d54baf536222b22a51fba4_b.jpg)

![Alt Text](https://s.coze.cn/t/cmdAkWul_g4/)



![Alt Text](https://lf3-static.bytednsdoc.com/obj/eden-cn/vhnupclkeh7nupkvhn/20250221-175449.jpeg)


![Alt Text](https://lf3-static.bytednsdoc.com/obj/eden-cn/rkzild_lgvj/ljhwZthlaukjlkulzlp/assets/imgs/coze-logo.png)
![Alt Text](https://lf3-static.bytednsdoc.com/obj/eden-cn/vhnupclkeh7nupkvhn/3bdef16c-3d10-43d0-9c4f-123abbee3a42.png)

as s \`node\`
## Html

<div>
 <strong>asdfasdf</strong>
  <video controls="" width="250">
    <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm" type="video/webm">
    <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4">
  </video>
</div>

## Tables

| Name  | Age | City     |
|-------|-----|----------|
| Alice | 30  | New York |
| Bob   | 25  | London   |

## Task Lists

You can create task lists in Markdown by using brackets. For example:

- [x] Write example document
- [ ] Publish document
- [ ] Share document with friends

- [x] 任务1
- [x] 任务2
- [ ] 任务3
  - [ ] 子任务1
  - [ ] 子任务2
  - [ ] 子任务3
- [ ] 任务4
  - [ ] 子任务1
  - [ ] 子任务2

### Unordered List

- Item 1
- Item 2
- Item 3

### Ordered List

1. Item 1
2. Item 2
3. Item 3

In Taro JS, to handle the \`input\` element losing focus (\`blur\` event), you can follow these steps:

1. **Create a Taro project**
   - If you haven't created a Taro project yet, you can use the Taro CLI to create one. For example, if you want to create a project using the React framework in Taro:
     \`\`\`bash
     npm install -g @tarojs/cli
     taro init my - project
     cd my - project
     \`\`\`
2. **Set up the \`input\` component with a \`blur\` event handler in a page or component**
   - In a Taro - React component (assuming you are using React with Taro):
   \`\`\`jsx
   import Taro, { Component } from '@tarojs/taro';
   import { View, Input } from '@tarojs/components';

   class MyPage extends Component {
     constructor(props) {
       super(props);
       this.state = {
         inputValue: ''
       };
       this.handleBlur = this.handleBlur.bind(this);
     }

     handleBlur(e) {
       const value = e.detail.value;
       // Do something with the input value when it loses focus
       console.log('Input lost focus, value is:', value);
       // You can also update the state if needed
       this.setState({
         inputValue: value
       });
     }

     render() {
       return (
         <View>
           <Input
             type="text"
             value={this.state.inputValue}
             onBlur={this.handleBlur}
           />
         </View>
       );
     }
   }

   export default MyPage;
   \`\`\`
   - In this example:
     - We first import the necessary components from \`@tarojs/taro\` and \`@tarojs/components\`.
     - In the constructor of the \`MyPage\` component, we initialize the state with an \`inputValue\` property and bind the \`handleBlur\` method to the component instance.
     - The \`handleBlur\` method is called when the \`input\` element loses focus. It retrieves the input value from the event object (\`e.detail.value\`), logs it to the console, and can also update the component's state if required.
     - In the \`render\` method, we render an \`Input\` component. We set its \`value\` to the \`inputValue\` in the state and attach the \`handleBlur\` method to the \`onBlur\` event.

If you are using Taro with Vue, the process is a bit different:

\`\`\`html
<template>
  <view>
    <input type="text" v - model="inputValue" @blur="handleBlur" />
  </view>
</template>

<script>
export default {
  data() {
    return {
      inputValue: ''
    };
  },
  methods: {
    handleBlur(e) {
      const value = e.detail.value;
      console.log('Input lost focus, value is:', value);
      this.inputValue = value;
    }
  }
};
</script>
\`\`\`

In this Vue - based Taro example:
- We use \`v - model\` to bind the \`input\`'s value to the \`inputValue\` data property.
- The \`@blur\` directive attaches the \`handleBlur\` method to the \`blur\` event of the \`input\` element. Inside \`handleBlur\`, we get the input value and can perform operations such as logging and updating the data.
`;
