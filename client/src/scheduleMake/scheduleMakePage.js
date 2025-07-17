import React, { useState } from "react";

export default class ScheduleMakePage extends React.Component {
    render() {
        return (
            <div>

                {/* 休暇時期プルダウン */}
                <select>
                    <option>夏休み</option>
                    <option>冬休み</option>
                    <option>春休み</option>
                </select>

                <label>開始日</label>
                <input type="date" />

                <label>終了日</label>
                <input type="date" />
                
                {/* 決定・下書きボタン */}
                <div>
                    <button>決定</button>
                    <button>下書き保存</button>
                </div>
            </div>

        )
    }
}