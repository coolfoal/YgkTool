import React, { useEffect, useState } from "react";
import { Input } from "mdui-in-react";
// @ts-expect-error ts-migrate(2305) FIXME: Module '"mdui"' has no exported member 'prompt'.
import { prompt as Prompt } from "mdui";
import Button from "@mui/material/Button";

//输入框&清空按钮
// const InputFiled = ({ onItemChange, items }: any) => {
// 	return (
// 		<>
// 			<Button
// 				className="mdui-float-right"
// 				onClick={() => {
// 					onItemChange("");
// 				}}
// 				mdui-tooltip="{content: '清空'}"
// 				icon="close"
// 			/>
// 			<div className="mdui-clearfix"></div>
// 			<Input
// 				onValueChange={onItemChange}
// 				rows={4}
// 				value={items}
// 				helper="输入待选物品，空格间隔"
// 			/>
// 		</>
// 	);
// };

/**
 * 渲染本地列表
 * @param param0
 */
const ReadLocal = ({ local, edit, onClickLi }: any) => {
	return local.map((cache: any, i: any) => (
		<li
			onClick={() => {
				onClickLi(i);
			}}
			key={i}
			className="mdui-col mdui-list-item mdui-ripple"
		>
			<div className="mdui-list-item-content">
				<span className="mdui-text-color-theme">{cache}</span>
			</div>

			<i
				onClick={() => {
					edit(i);
				}}
				className="mdui-list-item-icon mdui-icon material-icons"
			>
				edit
			</i>
		</li>
	));
};

//添加组合组件
const AddLocal = ({ onLocalChange }: any) => {
	return (
		<li
			onClick={() => {
				if (!localStorage.getItem("decision")) {
					localStorage.setItem("decision", JSON.stringify([]));
				}
				const cache = JSON.parse(localStorage.decision);
				Prompt(
					"使用空格分隔",
					(value: any) => {
						cache.push(value);
						localStorage.setItem("decision", JSON.stringify(cache));
						onLocalChange();
					},
					() => {
						/*取消事件*/
					},
					{
						type: "textarea",
						confirmText: "保存",
						cancelText: "取消",
						history: false,
					}
				);
			}}
			className="mdui-col mdui-list-item mdui-ripple"
		>
			<div className="mdui-list-item-content">
				<span className="mdui-text-color-theme">新增一个组合</span>
			</div>

			<i className="mdui-list-item-icon mdui-icon material-icons">add</i>
		</li>
	);
};

type StartState = {
	statu?: "stop" | "start";
	currentItem?: string;
	timer: any;
};

type StartProps = {
	statu?: any;
	items: string;
};

//开始随机组件
class Start extends React.Component<StartProps, StartState> {
	constructor(props: StartProps) {
		super(props);
		this.state = {
			statu: props.statu,
			currentItem: "点我开始！",
			timer: null,
		};
	}
	componentWillReceiveProps(nextProps: {}) {
		this.setState({
			// @ts-expect-error ts-migrate(2339) FIXME: Property 'statu' does not exist on type '{}'.
			statu: nextProps.statu,
			// @ts-expect-error ts-migrate(2339) FIXME: Property 'items' does not exist on type '{}'.
			items: nextProps.items,
		});
	}
	componentDidMount() {
		var timer = setInterval(() => {
			const { items } = this.props;
			let arr = items.split(" ");
			var maxNum = arr.length - 1;
			// @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
			var index = parseInt(Math.random() * (maxNum - 0 + 1) + 0, 10); //随机选取0到最大值之间的整数
			var currentItem = arr[index];
			if (this.state.statu == "start") {
				this.setState({
					currentItem: currentItem,
				});
			}
		}, 100);
		this.setState({
			timer,
		});
	}
	render() {
		return (
			<div className="mdui-text-center">
				<h1>{this.state.currentItem}</h1>
			</div>
		);
	}
}

const calcLocation = (r: number, percent: number): { x: number; y: number } => {
	const x = r * Math.cos(percent * 2 * Math.PI);
	const y = r * Math.sin(percent * 2 * Math.PI);
	return {
		x,
		y,
	};
};

const Pointer: React.FC<{}> = ({}) => {
	return (
		<>
			<svg></svg>
		</>
	);
};

function isOdd(num) {
	return num % 2;
}

const Lens: React.FC<{
	onStart: (statu: "start" | "stop") => void;
	items?: string[];
	resultIndex?: number;
	statu: "start" | "stop";
}> = ({ resultIndex, onStart, statu, items = ["脉动", "Cola", "茶"] }) => {
	const DEGREE_PER_ITEM = 360 / items.length;

	const [degree, setDegree] = useState(-DEGREE_PER_ITEM / 2);
	const [index, setIndex] = useState(0);

	const r: number = 300;

	const percent = 1 / items.length;

	useEffect(() => {
		if (resultIndex === null) return;

		const steps =
			resultIndex > index
				? resultIndex - index
				: items.length - index + resultIndex;
		const targetDegree =
			degree - steps * DEGREE_PER_ITEM + getRandom(0, 3) * 360;

		console.log(steps, items[resultIndex]);

		setDegree(targetDegree);
		setIndex(resultIndex);
	}, [resultIndex, statu]);

	return (
		<>
			<svg
				height={`${r * 2}px`}
				width={`${r * 2}px`}
				xmlns=""
				version="1.1"
				transform={`rotate(${
					degree + (getRandom(0, 3) / 10) * DEGREE_PER_ITEM - 90
				})`}
				style={{ transition: "transform 5s" }}
			>
				{Array(items.length)
					.fill(0)
					.map((item, i) => {
						return (
							<path
								fill="#66ccff"
								stroke="#000"
								d={`M${r} ${r} L${
									r + calcLocation(r, percent * i).x
								} ${r + calcLocation(r, percent * i).y}`}
							></path>
						);
					})}

				{items.map((item, i) => {
					return (
						<g
							font-size="30"
							line-height="30"
							font-family="sans-serif"
							fill="black"
							stroke="none"
							text-anchor="middle"
							transform={`rotate(${
								360 * (percent * i + percent / 2)
							})`}
							transform-origin="initial"
						>
							<text key={i + item} x={1.5 * r} y={r} dy={10}>
								{item}
							</text>
						</g>
					);
				})}

				<circle
					stroke="#888"
					fill="transparent"
					cx={r}
					cy={r}
					r={r}
				></circle>
			</svg>
		</>
	);
};

// get random number from range
const getRandom = (min: number, max: number) => {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

type ComponentState = {
	statu?: "stop" | "start";
	itemString?: string;
	resultString?: string;
	resultIndex?: number;
};

export default class Decision extends React.Component<{}, ComponentState> {
	constructor(props: {}) {
		super(props);
		this.state = {
			local: JSON.parse(localStorage.getItem("decision") || "[]"),
			statu: "stop",
			itemString: "First Second Third Forth Fifth",
			resultIndex: null,
		};
	}
	componentDidMount() {
		window.location.hash &&
			this.setState({
				items: decodeURI(window.location.hash.substring(1)),
			});
	}

	editItem = (key: any) => {
		const { local } = this.state;
		Prompt(
			"使用空格分隔",
			(value: any) => {
				var local = this.state.local;
				local.splice(key, 1, value);
				localStorage.setItem("decision", JSON.stringify(local));
			},
			() => {
				//删除组合
				let local = this.state.local;
				local.splice(key, 1);
				localStorage.setItem("decision", JSON.stringify(local));
			},
			{
				type: "textarea",
				defaultValue: local[key],
				confirmText: "保存",
				cancelText: "删除",
			}
		);
	};

	handleStart = () => {
		this.setState({
			statu: "start",
			resultIndex: getRandom(
				0,
				this.state.itemString.split(" ").length - 1
			),
		});
	};

	render() {
		const { statu, local, itemString, resultIndex } = this.state;
		return (
			<>
				<Lens
					resultIndex={resultIndex}
					items={itemString.split(" ")}
					onStart={this.handleStart}
					statu={statu}
				/>
				<Button onClick={this.handleStart}>GO</Button>
			</>
		);
	}
}
