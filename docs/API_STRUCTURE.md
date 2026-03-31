# API 응답 구조 문서

## Orders API

### Endpoint
`GET /api/Orders`

### Query Parameters
- `authGuid`: 사용자 인증 GUID
- `dateSearchMethod`: 날짜 검색 방법 (예: "LOAD")
- `startDate`: 시작 날짜 (YYYY-MM-DD)
- `endDate`: 종료 날짜 (YYYY-MM-DD)

### Response Structure

```json
{
  "result": [Array of Order objects],
  "code": 200,
  "message": ""
}
```

## Order Object Structure

### 기본 정보
| 필드명 | 타입 | 설명 |
|--------|------|------|
| `OrderNum` | string | 화물번호 |
| `OrdState` | string | 주문 상태 (예: "배차", "접수", "상차", "하차", "완료") |
| `OrdSubState` | string | 주문 하위 상태 |
| `OrderChannel` | string | 주문 채널 (예: "PARTNER") |
| `PartnerOrderNum` | string | 파트너 주문번호 |
| `Origin` | string | 출처 (예: "YLP") |

### 배차/화주 정보
| 필드명 | 타입 | 설명 |
|--------|------|------|
| `DispatchCompanyGuid` | string | 배차회사 GUID |
| `DispatchCompanyName` | string | 배차회사명 |
| `CargoCorpGuid` | string/null | 화주 GUID |
| `CargoCorpName` | string | 화주명 |
| `CargoCorpManagerName` | string | 화주 담당자명 |
| `CargoCorpContactNumber` | string | 화주 연락처 |
| `DispatchManagerGuid` | string | 배차 담당자 GUID |
| `DispatchManagerName` | string | 배차 담당자명 |
| `DispatchCallCenter` | string | 배차 콜센터 |

### 차량 정보
| 필드명 | 타입 | 설명 |
|--------|------|------|
| `ExpectCarType` | string | 예상 차종 (예: "윙바디") |
| `ExpectCarWeight` | string | 예상 톤수 (예: "1톤") |
| `ExpectCarBodyTypes` | array | 차체 타입 배열 (예: ["냉장"]) |
| `CargoWeight` | number | 화물 중량 |
| `CargoExpectCarCnt` | number | 예상 차량 대수 |

### 차주 정보
| 필드명 | 타입 | 설명 |
|--------|------|------|
| `CarOwnerGuid` | string/null | 차주 GUID |
| `CarName` | string | 차주명 |
| `CarPhoneNum` | string | 차주 연락처 |
| `CarNum` | string | 차량번호 |
| `CarWeight` | string | 차량 톤수 |
| `CarType` | string | 차량 타입 |

### 상차지 정보 (LoadArea)
| 필드명 | 타입 | 설명 |
|--------|------|------|
| `Guid` | string/null | GUID |
| `Date` | string | 상차 일시 (ISO 8601) |
| `CargoMoveMethod` | string | 화물 이동 방법 |
| `TimeSettingFlag` | number | 시간 설정 플래그 |
| `IsImmediatelyLoadDrop` | boolean | 즉시 상하차 여부 |
| `IsPunctuality` | boolean | 정시 여부 |
| `Name` | string | 장소명 |
| `Addr1` | string | 주소1 (시/도) |
| `Addr2` | string | 주소2 (시/군/구) |
| `Addr3` | string | 주소3 (읍/면/동) |
| `Addr4` | string | 주소4 (번지) |
| `AddrDetail` | string | 상세주소 |
| `RoadAddrPart1` | string/null | 도로명주소1 |
| `RoadAddrPart2` | string/null | 도로명주소2 |
| `FullAddr` | string | 전체 주소 |
| `Lat` | number | 위도 |
| `Lng` | number | 경도 |
| `ManagerName` | string | 담당자명 |
| `ManagerPhoneNum` | string | 담당자 연락처 |

### 하차지 정보 (DropArea)
상차지와 동일한 구조

### 경유지 정보 (Layovers)
배열 형태, 상차지/하차지와 유사한 구조

### 금액 정보
| 필드명 | 타입 | 설명 |
|--------|------|------|
| `PayMethod` | string | 결제 방법 (예: "신용") |
| `UnitPriceType` | string | 단가 유형 (예: "계약") |
| `Pay` | number | 지급액 |
| `BillSupply` | number | 청구 공급가 |
| `GrossProfit` | number | 총 이익 |
| `Commission` | number | 수수료 |
| `TotalSalesAddPay` | number | 총 청구 추가비용 |
| `TotalPurchaseAddPay` | number | 총 배차 추가비용 |
| `TotalSalesAmount` | number | 총 청구금 |
| `TotalPurchaseAmount` | number | 총 배차금 |

### 추가 비용 (AddPays)
배열 형태
```json
[
  {
    "Name": "추가비용명",
    "Amount": 10000,
    "Type": "비용타입",
    "Pay": 10000
  }
]
```

### 화물 정보
| 필드명 | 타입 | 설명 |
|--------|------|------|
| `Items` | string | 화물 품목 (예: "[ETC|0개|메모:유제품 1 PLT /]") |
| `AddRequests` | string | 추가 요청사항 |
| `Distance` | number | 거리 (km) |
| `EstimateTransitMinute` | number | 예상 운송 시간 (분) |

### 화물 세부 항목 (SubItems)
배열 형태
```json
[
  {
    "Guid": "uuid",
    "Spec": "ETC",
    "Weight": 0,
    "Quantity": 0,
    "Width": 0,
    "Length": 0,
    "Height": 0,
    "UnitWeight": 0,
    "Memo": "메모",
    "Unit": 0
  }
]
```

### 주문 유형 플래그
| 필드명 | 타입 | 설명 |
|--------|------|------|
| `IsAllowMix` | boolean | 혼적 허용 여부 |
| `IsRound` | boolean | 왕복 여부 |
| `IsUrgency` | boolean | 긴급 여부 |
| `IsLayover` | boolean | 경유 여부 |
| `MixLength` | number | 혼적 길이 |
| `MixWeight` | number | 혼적 중량 |

### 메타 정보
| 필드명 | 타입 | 설명 |
|--------|------|------|
| `RegistUserName` | string | 등록자명 |
| `RegistDate` | string | 등록일시 (ISO 8601) |
| `UpdateDate` | string | 수정일시 (ISO 8601) |
| `IsDeleted` | boolean | 삭제 여부 |
| `DeliveryReceiptCnt` | number | 배송 접수 건수 |
| `InnerMemos` | string/null | 내부 메모 |

## 예시 응답

```json
{
  "OrderNum": "26032707572",
  "OrdState": "배차",
  "OrdSubState": "",
  "OrderChannel": "PARTNER",
  "PartnerOrderNum": "202603270776",
  "DispatchCompanyGuid": "213bc9cd-ccb3-4c58-8001-ea9b28c2f4e3",
  "DispatchCompanyName": "나래로지스",
  "Origin": "YLP",
  "CargoCorpGuid": null,
  "CargoCorpName": "파스토_직영",
  "CargoCorpManagerName": "fassto01",
  "CargoCorpContactNumber": "01083135747",
  "ExpectCarType": "윙바디",
  "ExpectCarWeight": "1톤",
  "LoadArea": {
    "Date": "2026-03-31T09:30:01",
    "Name": "용인1센터 지하1층(저온)",
    "FullAddr": "경기 용인시 처인구 백암면 고안리 1736 용인1센터 지하1층 (신선)",
    "ManagerPhoneNum": "0215663033"
  },
  "DropArea": {
    "Date": "2026-03-31T10:30:01",
    "Name": "쿠치나(비마트)_저온(컵커피, 아이스크림)",
    "FullAddr": "경기 용인시 처인구 남사읍 완장리 73-5 쿠치나",
    "ManagerPhoneNum": "01048430416"
  },
  "Layovers": [],
  "PayMethod": "신용",
  "UnitPriceType": "계약",
  "TotalSalesAmount": 131000,
  "TotalPurchaseAmount": 120000,
  "Items": "[ETC|0개|메모:유제품 1 PLT /]",
  "AddRequests": "온도기록지 필\n오전 11시전 도착 필요\n명세서첨부",
  "IsAllowMix": false,
  "IsRound": false,
  "IsUrgency": false,
  "IsLayover": false,
  "CarName": "김선구",
  "CarPhoneNum": "01074139237",
  "CarNum": "인천86아2820",
  "RegistDate": "2026-03-27T13:29:05.134808",
  "UpdateDate": "2026-03-31T09:13:17.255748",
  "ExpectCarBodyTypes": ["냉장"],
  "AddPays": [],
  "SubItems": [
    {
      "Guid": "a8806e2b-6e83-46b1-90f7-68e64b5c78b6",
      "Spec": "ETC",
      "Weight": 0,
      "Quantity": 0,
      "Memo": "유제품 1 PLT"
    }
  ]
}
```

## 주문 상태 (OrdState) 값
- `접수`: 주문 접수됨
- `배차`: 배차 완료
- `상차`: 상차 완료
- `하차`: 하차 완료
- `완료`: 운송 완료

## 참고사항
- 날짜/시간은 ISO 8601 형식 사용
- GUID는 UUID 형식
- 금액은 숫자 타입 (원 단위)
- 빈 배열은 `[]`, null 허용 필드는 명시됨
