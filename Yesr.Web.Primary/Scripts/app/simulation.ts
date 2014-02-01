module App.Simulation {
    export var DiscountCategoryPercentages = { // they add up to 100%
        ReferralBonusCategoryPercentage: 10,
        CashBackBonusCategoryPercentage: 10,
        FundCategoryPercentage: 10,
        AdminFeeCategoryPercentage: 20,
        WalletCategoryPercentage: 50
    }

    export var SimulationValues = { 
        YBondValue: 100,
        Months: 12,
        InMerchantSpendPercentage: 50, // Out of the overall spend of merchant-enrolled members, 50% happen at the merchant!
        Variance: 25 // percentage of variance in each month - applies to spends and enrollments
    }

    export interface ISpecialBonusCategory {
        fromYBond: number;
        toYBond: number;
        coefficientA: number;
        coefficientB: number;
    }

    export class MemberCalculator {
        public static calculate(merchantDiscountPercentage: number, memberMonthlySpend: number, recruitsMonthlySpend: number, monthlyIncrementalRecruits: number, runningTotal: bool, monthlyMemberEnrollments: number): any {
            var result = {};

            var referralBonusPercentage = (merchantDiscountPercentage * DiscountCategoryPercentages.ReferralBonusCategoryPercentage) / 100;
            var cashBackBonusPercentage = (merchantDiscountPercentage * DiscountCategoryPercentages.CashBackBonusCategoryPercentage) / 100;
            var fundPercentage = (merchantDiscountPercentage * DiscountCategoryPercentages.FundCategoryPercentage) / 100;
            var AdminFeePercentage = (merchantDiscountPercentage * DiscountCategoryPercentages.AdminFeeCategoryPercentage) / 100;
            var walletMoneyPercentage = (merchantDiscountPercentage * DiscountCategoryPercentages.WalletCategoryPercentage) / 100;

            var memberSpendsArray = [];
            var recruitsSpendsArray = [];
            var merchantRevenuesArray = [];
            var merchantDiscountsArray = [];
            var memberYBondsArray = [];
            var recruitsYBondsArray = [];
            var cashBackBonusArray = [];
            var referralBonusArray = [];
            var cashBackBonusArray = [];
            var specialBonusArray = [];
            var totalBonusArray = [];
            
            var fundArray = [];
            var adminFeeArray = [];
            var walletMoneyArray = [];

            for (var month = 1; month <= SimulationValues.Months; month++) {
                // Used to vary the given values per month (plus or minus) - so the chart does not look so linear
                var _adjustment: number = 0;

                var variancePercentage: number = randomFromInterval(0, SimulationValues.Variance);
                var rand: number = randomFromInterval(0, 1);
                var variancePercentageDirection: number = 1;
                if (rand == 1)
                    variancePercentageDirection = -1;

                _adjustment = (((memberMonthlySpend * variancePercentage) / 100) * variancePercentageDirection);
                var adjustedMemberMonthlySpend: number = memberMonthlySpend + _adjustment;
                _adjustment = (((recruitsMonthlySpend * variancePercentage) / 100) * variancePercentageDirection);
                var adjustedRecruitsMonthlySpend: number = recruitsMonthlySpend + _adjustment;

                var memberYbonds: number = ((adjustedMemberMonthlySpend * walletMoneyPercentage) / 100) / SimulationValues.YBondValue;
                var recruitsYbonds: number = ((adjustedRecruitsMonthlySpend * walletMoneyPercentage) / 100) / SimulationValues.YBondValue;
                var cashBackBonus: number = (adjustedMemberMonthlySpend * cashBackBonusPercentage) / SimulationValues.YBondValue;
                
                _adjustment = (((monthlyIncrementalRecruits * variancePercentage) / 100) * variancePercentageDirection);
                var adjustedMonthlyIncrementalRecruits = monthlyIncrementalRecruits + _adjustment;

                _adjustment = (((monthlyMemberEnrollments * variancePercentage) / 100) * variancePercentageDirection);
                var adjustedMonthlyMemberEnrollments: number = monthlyMemberEnrollments + _adjustment;

                var merchantRevenue: number = 0; 
                if (monthlyMemberEnrollments > 1) {
                    merchantRevenue = ((adjustedMemberMonthlySpend * adjustedMonthlyMemberEnrollments) * SimulationValues.InMerchantSpendPercentage) / 100;
                } else {
                    merchantRevenue = ((adjustedMemberMonthlySpend + (adjustedRecruitsMonthlySpend * adjustedMonthlyIncrementalRecruits)) * SimulationValues.InMerchantSpendPercentage) / 100;
                }
                var merchantDiscount: number = (merchantRevenue * merchantDiscountPercentage) / 100;

                var referralBonus: number = 0; 
                if (monthlyMemberEnrollments > 1) {
                    referralBonus = ((adjustedMemberMonthlySpend * adjustedMonthlyMemberEnrollments) * referralBonusPercentage) / 100;
                } else {
                    referralBonus = ((adjustedRecruitsMonthlySpend * adjustedMonthlyIncrementalRecruits) * referralBonusPercentage) / 100;
                }

                var specialBonus: number = this.calculateSpecialBonus(memberYbonds, recruitsYbonds);
                var totalBonus: number = cashBackBonus + referralBonus + specialBonus;

                var fund: number = ((adjustedMemberMonthlySpend * fundPercentage) / 100) * adjustedMonthlyMemberEnrollments;
                var adminFee: number = ((adjustedMemberMonthlySpend * AdminFeePercentage) / 100) * adjustedMonthlyMemberEnrollments;
                var walletMoney: number = ((adjustedMemberMonthlySpend * walletMoneyPercentage) / 100) * adjustedMonthlyMemberEnrollments;

                memberYBondsArray.push(memberYbonds);
                recruitsYBondsArray.push(recruitsYbonds);
                merchantRevenuesArray.push(merchantRevenue);
                merchantDiscountsArray.push(merchantDiscount);
                cashBackBonusArray.push(cashBackBonus);
                referralBonusArray.push(referralBonus);
                specialBonusArray.push(specialBonus);
                totalBonusArray.push(totalBonus);
                fundArray.push(fund);
                adminFeeArray.push(adminFee);
                walletMoneyArray.push(walletMoney);
            }

            if (runningTotal) {
                for (var i = 1; i < memberYBondsArray.length; i++) {
                    memberYBondsArray[i] = memberYBondsArray[i - 1] + memberYBondsArray[i];
                }

                for (var i = 1; i < recruitsYBondsArray.length; i++) {
                    recruitsYBondsArray[i] = recruitsYBondsArray[i - 1] + recruitsYBondsArray[i];
                }

                for (var i = 1; i < merchantRevenuesArray.length; i++) {
                    merchantRevenuesArray[i] = merchantRevenuesArray[i - 1] + merchantRevenuesArray[i];
                }

                for (var i = 1; i < merchantDiscountsArray.length; i++) {
                    merchantDiscountsArray[i] = merchantDiscountsArray[i - 1] + merchantDiscountsArray[i];
                }

                for (var i = 1; i < cashBackBonusArray.length; i++) {
                    cashBackBonusArray[i] = cashBackBonusArray[i - 1] + cashBackBonusArray[i];
                }

                for (var i = 1; i < referralBonusArray.length; i++) {
                    referralBonusArray[i] = referralBonusArray[i - 1] + referralBonusArray[i];
                }

                for (var i = 1; i < specialBonusArray.length; i++) {
                    specialBonusArray[i] = specialBonusArray[i - 1] + specialBonusArray[i];
                }

                for (var i = 1; i < totalBonusArray.length; i++) {
                    totalBonusArray[i] = totalBonusArray[i - 1] + totalBonusArray[i];
                }

                for (var i = 1; i < fundArray.length; i++) {
                    fundArray[i] = fundArray[i - 1] + fundArray[i];
                }

                for (var i = 1; i < adminFeeArray.length; i++) {
                    adminFeeArray[i] = adminFeeArray[i - 1] + adminFeeArray[i];
                }

                for (var i = 1; i < walletMoneyArray.length; i++) {
                    walletMoneyArray[i] = walletMoneyArray[i - 1] + walletMoneyArray[i];
                }
            }

            result['MemberYBonds'] = memberYBondsArray;
            result['RecruitsYBonds'] = recruitsYBondsArray;
            result['MerchantRevenues'] = merchantRevenuesArray;
            result['MerchantDiscounts'] = merchantDiscountsArray;
            result['CashBackBonus'] = cashBackBonusArray;
            result['ReferralBonus'] = referralBonusArray;
            result['SpecialBonus'] = specialBonusArray;
            result['TotalBonus'] = totalBonusArray;
            result['Fund'] = fundArray;
            result['AdminFee'] = adminFeeArray;
            result['WalletMoney'] = walletMoneyArray;

            return result;
        }

        private static calculateSpecialBonus(memberYbonds: number, recruitsYbonds: number): number {
            // Load the special bonus categories
            var categories: ISpecialBonusCategory[];
            categories = [
                { fromYBond: 1, toYBond: 4, coefficientA: 7.5, coefficientB: 5 },
                { fromYBond: 5, toYBond: 8, coefficientA: 10, coefficientB: 7.5 },
                { fromYBond: 9, toYBond: 12, coefficientA: 12, coefficientB: 9 },
                { fromYBond: 13, toYBond: 18, coefficientA: 15, coefficientB: 12 },
                { fromYBond: 19, toYBond: 25, coefficientA: 20, coefficientB: 15 },
                { fromYBond: 26, toYBond: 50, coefficientA: 25, coefficientB: 20 },
                { fromYBond: 51, toYBond: 70, coefficientA: 30, coefficientB: 25 },
                { fromYBond: 71, toYBond: 90, coefficientA: 40, coefficientB: 30 },
                { fromYBond: 91, toYBond: 110, coefficientA: 50, coefficientB: 40 },
                { fromYBond: 111, toYBond: 130, coefficientA: 60, coefficientB: 50 },
                { fromYBond: 131, toYBond: 150, coefficientA: 80, coefficientB: 60 },
                { fromYBond: 151, toYBond: 7878787870908, coefficientA: 100, coefficientB: 90 }
            ];

            var totalYBonds = memberYbonds + recruitsYbonds;
            if (totalYBonds == 0)
                return 0;

            for (var i = 0; i < categories.length; i++) {
                if (totalYBonds >= categories[i].fromYBond && totalYBonds <= categories[i].toYBond)
                    return (memberYbonds * categories[i].coefficientA) + (recruitsYbonds * categories[i].coefficientB);
            }

            return 0;
        }

        public static getChartGrayTheme() {
            return {
                colors: ["#DDDF0D", "#7798BF", "#55BF3B", "#DF5353", "#aaeeee", "#ff0066", "#eeaaee",
                    "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
                chart: {
                    backgroundColor: {
                        linearGradient: [0, 0, 0, 400],
                        stops: [
                        ['0', 'rgb(96, 96, 96)'],
                        ['1', 'rgb(16, 16, 16)']
                        ]
                    },
                    borderWidth: 0,
                    borderRadius: 15,
                    plotBackgroundColor: null,
                    plotShadow: false,
                    plotBorderWidth: 0
                },
                title: {
                    style: {
                        color: '#FFF',
                        font: '16px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
                    }
                },
                subtitle: {
                    style: {
                        color: '#DDD',
                        font: '12px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
                    }
                },
                xAxis: {
                    gridLineWidth: 0,
                    lineColor: '#999',
                    tickColor: '#999',
                    labels: {
                        style: {
                        color: '#999',
                        fontWeight: 'bold'
                        }
                    },
                    title: {
                        style: {
                        color: '#AAA',
                        font: 'bold 12px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
                        }
                    }
                },
                yAxis: {
                    alternateGridColor: null,
                    minorTickInterval: null,
                    gridLineColor: 'rgba(255, 255, 255, .1)',
                    lineWidth: 0,
                    tickWidth: 0,
                    labels: {
                        style: {
                        color: '#999',
                        fontWeight: 'bold'
                        }
                    },
                    title: {
                        style: {
                        color: '#AAA',
                        font: 'bold 12px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
                        }
                    }
                },
                legend: {
                    itemStyle: {
                        color: '#CCC'
                    },
                    itemHoverStyle: {
                        color: '#FFF'
                    },
                    itemHiddenStyle: {
                        color: '#333'
                    }
                },
                labels: {
                    style: {
                        color: '#CCC'
                    }
                },
                tooltip: {
                    backgroundColor: {
                        linearGradient: [0, 0, 0, 50],
                        stops: [
                        ['0', 'rgba(96, 96, 96, .8)'],
                        ['1', 'rgba(16, 16, 16, .8)']
                        ]
                    },
                    borderWidth: 0,
                    style: {
                        color: '#FFF'
                    }
                },


                plotOptions: {
                    line: {
                        dataLabels: {
                        color: '#CCC'
                        },
                        marker: {
                        lineColor: '#333'
                        }
                    },
                    spline: {
                        marker: {
                        lineColor: '#333'
                        }
                    },
                    scatter: {
                        marker: {
                        lineColor: '#333'
                        }
                    },
                    candlestick: {
                        lineColor: 'white'
                    }
                },

                toolbar: {
                    itemStyle: {
                        color: '#CCC'
                    }
                },

                navigation: {
                    buttonOptions: {
                        backgroundColor: {
                        linearGradient: [0, 0, 0, 20],
                        stops: [
                            ['0.4', '#606060'],
                            ['0.6', '#333333']
                        ]
                        },
                        borderColor: '#000000',
                        symbolStroke: '#C0C0C0',
                        hoverSymbolStroke: '#FFFFFF'
                    }
                },

                exporting: {
                    buttons: {
                        exportButton: {
                        symbolFill: '#55BE3B'
                        },
                        printButton: {
                        symbolFill: '#7797BE'
                        }
                    }
                },

                // scroll charts
                rangeSelector: {
                    buttonTheme: {
                        fill: {
                        linearGradient: [0, 0, 0, 20],
                        stops: [
                            ['0.4', '#888'],
                            ['0.6', '#555']
                        ]
                        },
                        stroke: '#000000',
                        style: {
                        color: '#CCC',
                        fontWeight: 'bold'
                        },
                        states: {
                        hover: {
                            fill: {
                                linearGradient: [0, 0, 0, 20],
                                stops: [
                                    ['0.4', '#BBB'],
                                    ['0.6', '#888']
                                ]
                            },
                            stroke: '#000000',
                            style: {
                                color: 'white'
                            }
                        },
                        select: {
                            fill: {
                                linearGradient: [0, 0, 0, 20],
                                stops: [
                                    ['0.1', '#000'],
                                    ['0.3', '#333']
                                ]
                            },
                            stroke: '#000000',
                            style: {
                                color: 'yellow'
                            }
                        }
                        }
                    },
                    inputStyle: {
                        backgroundColor: '#333',
                        color: 'silver'
                    },
                    labelStyle: {
                        color: 'silver'
                    }
                },

                navigator: {
                    handles: {
                        backgroundColor: '#666',
                        borderColor: '#AAA'
                    },
                    outlineColor: '#CCC',
                    maskFill: 'rgba(16, 16, 16, 0.5)',
                    series: {
                        color: '#7798BF',
                        lineColor: '#A6C7ED'
                    }
                },

                scrollbar: {
                    barBackgroundColor: {
                        linearGradient: [0, 0, 0, 20],
                        stops: [
                            ['0.4', '#888'],
                            ['0.6', '#555']
                        ]
                        },
                    barBorderColor: '#CCC',
                    buttonArrowColor: '#CCC',
                    buttonBackgroundColor: {
                        linearGradient: [0, 0, 0, 20],
                        stops: [
                            ['0.4', '#888'],
                            ['0.6', '#555']
                        ]
                        },
                    buttonBorderColor: '#CCC',
                    rifleColor: '#FFF',
                    trackBackgroundColor: {
                        linearGradient: [0, 0, 0, 10],
                        stops: [
                        ['0', '#000'],
                        ['1', '#333']
                        ]
                    },
                    trackBorderColor: '#666'
                },

                // special colors for some of the demo examples
                legendBackgroundColor: 'rgba(48, 48, 48, 0.8)',
                legendBackgroundColorSolid: 'rgb(70, 70, 70)',
                dataLabelsColor: '#444',
                textColor: '#E0E0E0',
                maskColor: 'rgba(255,255,255,0.3)'
            };
		}

        private static randomFromInterval(from, to) {
            return Math.floor(Math.random() * (to - from + 1) + from);
        }
    }
}
