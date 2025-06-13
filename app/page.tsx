"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ArrowLeftRightIcon } from "lucide-react"

export default function RealEstateCalculator() {
  // 計算モード（true: 購入価格→一種単価, false: 一種単価→購入価格）
  const [forwardCalculation, setForwardCalculation] = useState(true)

  // 入力値
  const [purchasePrice, setPurchasePrice] = useState("")
  const [expenses, setExpenses] = useState("")
  const [areaInSqMeters, setAreaInSqMeters] = useState("")
  const [floorAreaRatio, setFloorAreaRatio] = useState("")
  const [bidRate, setBidRate] = useState(1)
  const [type1UnitPrice, setType1UnitPrice] = useState("")

  // 計算結果
  const [builtInUnitPrice, setBuiltInUnitPrice] = useState("")
  const [calculatedType1UnitPrice, setCalculatedType1UnitPrice] = useState("")
  const [expectedPurchasePrice, setExpectedPurchasePrice] = useState("")

  // 計算に使用する数値
  const [purchasePriceNum, setPurchasePriceNum] = useState(0)
  const [expensesNum, setExpensesNum] = useState(0)
  const [areaInSqMetersNum, setAreaInSqMetersNum] = useState(0)
  const [areaInTsuboNum, setAreaInTsuboNum] = useState(0)
  const [floorAreaRatioNum, setFloorAreaRatioNum] = useState(0)
  const [type1UnitPriceNum, setType1UnitPriceNum] = useState(0)

  // テーマカラー
  const themeColor = forwardCalculation ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
  const buttonColor = forwardCalculation ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"

  // 数値をフォーマットする関数（カンマ区切り）
  const formatNumber = (value: string) => {
    if (!value) return ""
    const number = Number.parseFloat(value.replace(/,/g, ""))
    if (isNaN(number)) return ""
    return number.toLocaleString()
  }

  // 数値からカンマを取り除く関数
  const unformatNumber = (value: string) => {
    return value.replace(/,/g, "")
  }

  // 平米から坪への変換
  const sqMeterToTsubo = (sqMeter: number) => {
    return sqMeter / 3.30578
  }

  // 計算を実行
  useEffect(() => {
    // 共通の数値変換
    const purchaseNum = Number.parseFloat(unformatNumber(purchasePrice) || "0")
    const expensesNum = Number.parseFloat(unformatNumber(expenses) || "0")
    const areaInSqMetersNum = Number.parseFloat(unformatNumber(areaInSqMeters) || "0")
    const areaInTsuboNum = sqMeterToTsubo(areaInSqMetersNum)
    const floorAreaRatioNum = Number.parseFloat(unformatNumber(floorAreaRatio) || "0") / 100
    const type1UnitPriceNum = Number.parseFloat(unformatNumber(type1UnitPrice) || "0")

    // 計算に使用する数値を保存
    setPurchasePriceNum(purchaseNum)
    setExpensesNum(expensesNum)
    setAreaInSqMetersNum(areaInSqMetersNum)
    setAreaInTsuboNum(areaInTsuboNum)
    setFloorAreaRatioNum(floorAreaRatioNum)
    setType1UnitPriceNum(type1UnitPriceNum)

    if (forwardCalculation) {
      // 購入価格→一種単価の計算
      if (purchaseNum && areaInSqMetersNum && floorAreaRatioNum) {
        const builtInPrice = purchaseNum / areaInTsuboNum
        const type1Price = builtInPrice / floorAreaRatioNum

        setBuiltInUnitPrice(builtInPrice.toLocaleString())
        setCalculatedType1UnitPrice(type1Price.toLocaleString())
      } else {
        setBuiltInUnitPrice("")
        setCalculatedType1UnitPrice("")
      }
    } else {
      // 一種単価→購入価格の計算
      if (type1UnitPriceNum && areaInSqMetersNum && floorAreaRatioNum) {
        const expectedPrice = type1UnitPriceNum * areaInTsuboNum * floorAreaRatioNum * bidRate + expensesNum

        setExpectedPurchasePrice(expectedPrice.toLocaleString())
      } else {
        setExpectedPurchasePrice("")
      }
    }
  }, [purchasePrice, expenses, areaInSqMeters, floorAreaRatio, bidRate, type1UnitPrice, forwardCalculation])

  // 計算方向を切り替える
  const toggleCalculationDirection = () => {
    setForwardCalculation(!forwardCalculation)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className={`w-full max-w-4xl mx-auto ${themeColor} transition-colors duration-300`}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">不動産査定計算機</CardTitle>
            <CardDescription>
              {forwardCalculation ? "購入価格から一種単価を計算" : "一種単価から購入期待価格を計算"}
            </CardDescription>
          </div>
          <Button variant="outline" onClick={toggleCalculationDirection} className={`${buttonColor} text-white`}>
            <ArrowLeftRightIcon className="h-4 w-4 mr-2" />
            計算方向を切替
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            {/* 左側: 入力フィールド */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium">入力項目</h3>

              {forwardCalculation ? (
                // 購入価格→一種単価モードの入力フィールド
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="purchasePrice">購入価格（万円）</Label>
                    <Input
                      id="purchasePrice"
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(e.target.value)}
                      onBlur={(e) => setPurchasePrice(formatNumber(e.target.value))}
                      inputMode="decimal"
                      placeholder="0"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="areaInSqMeters">面積（平米）</Label>
                    <Input
                      id="areaInSqMeters"
                      value={areaInSqMeters}
                      onChange={(e) => setAreaInSqMeters(e.target.value)}
                      onBlur={(e) => setAreaInSqMeters(formatNumber(e.target.value))}
                      inputMode="decimal"
                      placeholder="0"
                    />
                    <div className="text-xs text-muted-foreground">坪数: {areaInTsuboNum.toFixed(2)} 坪</div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="floorAreaRatio">容積率（%）</Label>
                    <Input
                      id="floorAreaRatio"
                      value={floorAreaRatio}
                      onChange={(e) => setFloorAreaRatio(e.target.value)}
                      onBlur={(e) => setFloorAreaRatio(formatNumber(e.target.value))}
                      inputMode="decimal"
                      placeholder="0"
                    />
                  </div>
                </div>
              ) : (
                // 一種単価→購入期待価格モードの入力フィールド
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type1UnitPrice">一種単価（万円/坪）</Label>
                    <Input
                      id="type1UnitPrice"
                      value={type1UnitPrice}
                      onChange={(e) => setType1UnitPrice(e.target.value)}
                      onBlur={(e) => setType1UnitPrice(formatNumber(e.target.value))}
                      inputMode="decimal"
                      placeholder="0"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="areaInSqMeters">面積（平米）</Label>
                    <Input
                      id="areaInSqMeters"
                      value={areaInSqMeters}
                      onChange={(e) => setAreaInSqMeters(e.target.value)}
                      onBlur={(e) => setAreaInSqMeters(formatNumber(e.target.value))}
                      inputMode="decimal"
                      placeholder="0"
                    />
                    <div className="text-xs text-muted-foreground">坪数: {areaInTsuboNum.toFixed(2)} 坪</div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="floorAreaRatio">容積率（%）</Label>
                    <Input
                      id="floorAreaRatio"
                      value={floorAreaRatio}
                      onChange={(e) => setFloorAreaRatio(e.target.value)}
                      onBlur={(e) => setFloorAreaRatio(formatNumber(e.target.value))}
                      inputMode="decimal"
                      placeholder="0"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 右側: 計算結果 */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium">計算結果</h3>

              <div className={`p-6 rounded-lg border ${themeColor} transition-colors duration-300`}>
                {forwardCalculation ? (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">
                        {purchasePrice ? `${purchasePrice} 万円` : "購入価格"} ÷ {areaInTsuboNum.toFixed(2)} 坪 =
                        建込坪単価
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">建込坪単価:</span>
                        <span className="font-bold text-xl">{builtInUnitPrice || "0"} 万円/坪</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-4 border-t">
                      <div className="text-sm font-medium">
                        {builtInUnitPrice ? `${builtInUnitPrice} 万円/坪` : "建込坪単価"} ÷{" "}
                        {floorAreaRatioNum ? (floorAreaRatioNum * 100).toFixed(0) : "容積率"}% = 一種単価
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">一種単価:</span>
                        <span className="font-bold text-2xl text-green-700">
                          {calculatedType1UnitPrice || "0"} 万円/坪
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">
                        {type1UnitPrice ? `${type1UnitPrice} 万円/坪` : "一種単価"} × {areaInTsuboNum.toFixed(2)} 坪 ×{" "}
                        {floorAreaRatioNum ? (floorAreaRatioNum * 100).toFixed(0) : "容積率"}% × 指値率 + 経費 =
                        購入期待価格
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">購入期待価格:</span>
                        <span className="font-bold text-2xl text-red-700">{expectedPurchasePrice || "0"} 万円</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div className="space-y-2">
                        <Label htmlFor="expenses">経費（万円）</Label>
                        <Input
                          id="expenses"
                          value={expenses}
                          onChange={(e) => setExpenses(e.target.value)}
                          onBlur={(e) => setExpenses(formatNumber(e.target.value))}
                          inputMode="decimal"
                          placeholder="0"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bidRate">指値率: {(bidRate * 100).toFixed(0)}%</Label>
                        <div className="flex items-center gap-2">
                          <Slider
                            id="bidRate"
                            min={0.5}
                            max={1}
                            step={0.01}
                            value={[bidRate]}
                            onValueChange={(value) => setBidRate(value[0])}
                            className="flex-1"
                          />
                          <Input
                            value={bidRate}
                            onChange={(e) => {
                              const value = Number.parseFloat(e.target.value)
                              if (!isNaN(value) && value >= 0.5 && value <= 1) {
                                setBidRate(value)
                              }
                            }}
                            className="w-16"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
