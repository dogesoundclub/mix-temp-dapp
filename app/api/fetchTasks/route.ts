import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs'
import path from "path"

function replacer(key, value) {
    if (typeof value === 'bigint') {
      return value.toString(); // BigInt를 문자열로 변환
    }
    return value; // 기타 모든 값은 변환하지 않음
  }

export async function GET(req: NextRequest, res: NextResponse) {
    console.log("GET /api/fetchTasks")
    console.log(process.cwd())
    const data = fs.readFileSync(path.join(__dirname, 'tasks.json'), 'utf-8')
    console.log("data------", data)
    const jsonResponse = JSON.stringify({
        statusCode: 200,
        data: JSON.parse(data),
        message: "200 OK"
      }, replacer);

    return NextResponse.json(JSON.parse(jsonResponse)); // 문자열을 다시 객체로 변환하여 응답 생성
}
