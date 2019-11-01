const esprima = require('esprima');
const babel = require("@babel/core");
function ES62ES5(code){
  const regexp1 = /export default/gim;
  code = code.replace(regexp1, 'exports.default=');
  const regexp2 = /export\s+{([^}]+)}/gim;
  code = code.replace(regexp2, function(matchStr, catchStr) {
    let catchVeriates = catchStr.replace(/\s/gi, '').split(',');
    let result = '';
    catchVeriates.map((v)=>{
      result += `exports.${v}=${v};`
    });
    return result;
  });
  return code;
}
function analyze(source) {
	source = ES62ES5(source);
	const ast = esprima.parse(source);
	const astBody = ast.body;
	const global = {
		exports: {}
	};
	for(let i=0; i< astBody.length; i++){
		let item = astBody[i];
		// 变量定义
		if(item.type==='VariableDeclaration') {
			item.declarations.map(variate=>{
				global[variate.id.name] = undefined;
				// 变量类型
				switch(variate.init.type) {
					// 常量
					case "Literal":
						global[variate.id.name] = variate.init.value;
						break;
					// 数组
					case "ArrayExpression":
						global[variate.id.name] = toArray(variate.init.elements, global);
						break;
					// 对象
					case "ObjectExpression":
						global[variate.id.name] = toObject(variate.init.properties, global);
						break;
					// 直接赋值其他变量
					case "Identifier":
						global[variate.id.name] = global[variate.init.name];
						break;
					// 传递其他对象的属性
					case "MemberExpression":
						//if(variate.init.computed) {
							global[variate.id.name] = getMemberExpressionValue(variate.init, global);
						//}
						break;
					// 计算
					case "BinaryExpression": 
						global[variate.id.name] = compute(variate.init, global)
						break;
					default:
						global[variate.id.name] = '特殊类型：' + variate.init.type;
				}
			})
		}
		// 赋值
		if(item.type==='ExpressionStatement'){
			let left = item.expression.left;
			let right = item.expression.right;
			let value = undefined;
			switch(item.operator) {
				case '=':
				
					break;
			}
			switch(right.type){
				// 常量
				case 'Literal':
					value = right.value;
					break;
				// 变量
				case 'Identifier':
					value = global[right.name]
					break;
				// 直接赋值其他变量
				case "Identifier":
					value = global[variate.init.name];
					break;
				case 'BinaryExpression':
					value = compute(right.left.value, right.right.value, right.operator);
					break;
			}
			switch(left.type) {
				// 变量
				case 'Identifier':
					global[left.name] = value;
					break;
				case "MemberExpression":
					setMemberExpressionValue(left, global, value);
					break;
			}
		}
	}
	return global;
}


function compute(expression, global) {
	let left = expression.left;
	let right = expression.right;
	let leftValue = undefined;
	let rightValue = undefined;
	
}
function toArray(elements, global, array=[]) {
	elements.map(item=>{
		switch(item.type) {
			case 'Literal':
				array.push(item.value);
				break;
			case "Identifier":
			  array.push(global[item.name]);
			  break;	
			case "MemberExpression":
				array.push(getMemberExpressionValue(item, global));
				break;
			case 'ArrayExpression':
				array.push(toArray(item.init.elements, global));
				break;
			case "ObjectExpression":
				array.push(toObject(item.init.properties, global));
				break;
		}
	})
	return array
}
function toObject(properties, global, object={}) {
	properties.map(item=>{
		let key = item.key.name;
		let value = item.value;
		switch(value.type) {
			case 'Literal':
				object[key] = value.value;
				break;
			case "Identifier":
			    object[key] = global[value.name];
			    break;	
			case "MemberExpression":
				object[key] = getMemberExpressionValue(value, global);
				break;
			case 'ArrayExpression':
				object[key] = toArray(value.elements, global);
				break;
			case "ObjectExpression":
				object[key] = toObject(value.properties, global);
				break;
		}
	})
	return object;
}
function getMemberExpressionValue(expression, global) {
	let paths = memberExpressionPath(expression),
		g = global;
	paths.map(path=>{
		g = g[path];
	})
	return g;
}
function memberExpressionPath(expression, path=[]) {
	if(expression.object.type === 'MemberExpression') {
	  memberExpressionPath(expression.object, path);
	}
	else {
		path.push(expression.object.name);
	}
	if(expression.property.type === 'Literal')
		path.push(expression.property.value);
	else
		path.push(expression.property.name);
	return path
}
function setMemberExpressionValue(expression, global, value) { 
	let paths = memberExpressionPath(expression),
	g = global;
	let lastPath = paths.pop();
	paths.map(path=>{
		g = g[path];
	})
	g[lastPath] = value;
}
module.exports = analyze
