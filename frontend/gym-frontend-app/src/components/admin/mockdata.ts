// src/data/mockData.ts

export interface ReportDataItem {
    gymLocation: string;
    coachName: string;
    email: string;
    periodStart: string;
    periodEnd: string;
    workouts: number;
    change: string;
    feedback: number;
  }
  
  // Coach Performance Report Data - 30 entries
  export const coachPerformanceData: ReportDataItem[] = [
    // Hrushevsky Street, 16, Kyiv - 10 coaches
    {
      gymLocation: "Hrushevsky Street, 16, Kyiv",
      coachName: "Kristin Watson",
      email: "Kristin_Watson@xyz.com",
      periodStart: "01.05.2025",
      periodEnd: "15.05.2025",
      workouts: 30,
      change: "-10%",
      feedback: 4.2
    },
    {
      gymLocation: "Hrushevsky Street, 16, Kyiv",
      coachName: "Jacob Jones",
      email: "Jacob_Jones@xyz.com",
      periodStart: "05.05.2025",
      periodEnd: "20.05.2025",
      workouts: 32,
      change: "-3%",
      feedback: 4.9
    },
    {
      gymLocation: "Hrushevsky Street, 16, Kyiv",
      coachName: "Bessie Cooper",
      email: "Bessie.Cooper@xyz.com",
      periodStart: "10.05.2025",
      periodEnd: "25.05.2025",
      workouts: 36,
      change: "+7%",
      feedback: 4.7
    },
    {
      gymLocation: "Hrushevsky Street, 16, Kyiv",
      coachName: "Robert Fox",
      email: "Robert.Fox@xyz.com",
      periodStart: "01.06.2025",
      periodEnd: "15.06.2025",
      workouts: 38,
      change: "+15%",
      feedback: 4.6
    },
    {
      gymLocation: "Hrushevsky Street, 16, Kyiv",
      coachName: "Jenny Wilson",
      email: "Jenny.Wilson@xyz.com",
      periodStart: "05.06.2025",
      periodEnd: "20.06.2025",
      workouts: 27,
      change: "-5%",
      feedback: 4.3
    },
    {
      gymLocation: "Hrushevsky Street, 16, Kyiv",
      coachName: "Esther Howard",
      email: "Esther.Howard@xyz.com",
      periodStart: "15.05.2025",
      periodEnd: "30.05.2025",
      workouts: 33,
      change: "+8%",
      feedback: 4.5
    },
    {
      gymLocation: "Hrushevsky Street, 16, Kyiv",
      coachName: "Devon Lane",
      email: "Devon.Lane@xyz.com",
      periodStart: "10.06.2025",
      periodEnd: "25.06.2025",
      workouts: 29,
      change: "-2%",
      feedback: 4.0
    },
    {
      gymLocation: "Hrushevsky Street, 16, Kyiv",
      coachName: "Courtney Henry",
      email: "Courtney.Henry@xyz.com",
      periodStart: "01.07.2025",
      periodEnd: "15.07.2025",
      workouts: 34,
      change: "+4%",
      feedback: 4.4
    },
    {
      gymLocation: "Hrushevsky Street, 16, Kyiv",
      coachName: "Theresa Webb",
      email: "Theresa.Webb@xyz.com",
      periodStart: "05.07.2025",
      periodEnd: "20.07.2025",
      workouts: 31,
      change: "+1%",
      feedback: 4.2
    },
    {
      gymLocation: "Hrushevsky Street, 16, Kyiv",
      coachName: "Kathryn Murphy",
      email: "Kathryn.Murphy@xyz.com",
      periodStart: "15.07.2025",
      periodEnd: "30.07.2025",
      workouts: 28,
      change: "-7%",
      feedback: 3.9
    },
    
    // Roosewelt Street, 83, Kyiv - 10 coaches
    {
      gymLocation: "Roosewelt Street, 83, Kyiv",
      coachName: "Cameron Williamson",
      email: "Cameron.W@xyz.com",
      periodStart: "01.05.2025",
      periodEnd: "15.05.2025",
      workouts: 28,
      change: "+5%",
      feedback: 4.5
    },
    {
      gymLocation: "Roosewelt Street, 83, Kyiv",
      coachName: "Leslie Alexander",
      email: "Leslie.A@xyz.com",
      periodStart: "05.05.2025",
      periodEnd: "20.05.2025",
      workouts: 42,
      change: "+12%",
      feedback: 4.8
    },
    {
      gymLocation: "Roosewelt Street, 83, Kyiv",
      coachName: "Albert Flores",
      email: "Albert.F@xyz.com",
      periodStart: "10.05.2025",
      periodEnd: "25.05.2025",
      workouts: 45,
      change: "+20%",
      feedback: 4.9
    },
    {
      gymLocation: "Roosewelt Street, 83, Kyiv",
      coachName: "Savannah Nguyen",
      email: "Savannah.N@xyz.com",
      periodStart: "01.06.2025",
      periodEnd: "15.06.2025",
      workouts: 33,
      change: "+8%",
      feedback: 4.4
    },
    {
      gymLocation: "Roosewelt Street, 83, Kyiv",
      coachName: "Cody Fisher",
      email: "Cody.Fisher@xyz.com",
      periodStart: "05.06.2025",
      periodEnd: "20.06.2025",
      workouts: 39,
      change: "+10%",
      feedback: 4.7
    },
    {
      gymLocation: "Roosewelt Street, 83, Kyiv",
      coachName: "Jerome Bell",
      email: "Jerome.Bell@xyz.com",
      periodStart: "15.06.2025",
      periodEnd: "30.06.2025",
      workouts: 36,
      change: "+5%",
      feedback: 4.6
    },
    {
      gymLocation: "Roosewelt Street, 83, Kyiv",
      coachName: "Marvin McKinney",
      email: "Marvin.M@xyz.com",
      periodStart: "01.07.2025",
      periodEnd: "15.07.2025",
      workouts: 41,
      change: "+9%",
      feedback: 4.8
    },
    {
      gymLocation: "Roosewelt Street, 83, Kyiv",
      coachName: "Annette Black",
      email: "Annette.B@xyz.com",
      periodStart: "05.07.2025",
      periodEnd: "20.07.2025",
      workouts: 37,
      change: "+6%",
      feedback: 4.5
    },
    {
      gymLocation: "Roosewelt Street, 83, Kyiv",
      coachName: "Floyd Miles",
      email: "Floyd.M@xyz.com",
      periodStart: "15.07.2025",
      periodEnd: "30.07.2025",
      workouts: 34,
      change: "+2%",
      feedback: 4.3
    },
    {
      gymLocation: "Roosewelt Street, 83, Kyiv",
      coachName: "Darrell Steward",
      email: "Darrell.S@xyz.com",
      periodStart: "01.08.2025",
      periodEnd: "15.08.2025",
      workouts: 38,
      change: "+7%",
      feedback: 4.6
    },
    
    // Greyjoy Manor, 16, Kyiv - 10 coaches
    {
      gymLocation: "Greyjoy Manor, 16, Kyiv",
      coachName: "Dianne Russell",
      email: "Dianne.R@xyz.com",
      periodStart: "01.05.2025",
      periodEnd: "15.05.2025",
      workouts: 25,
      change: "-8%",
      feedback: 4.0
    },
    {
      gymLocation: "Greyjoy Manor, 16, Kyiv",
      coachName: "Brooklyn Simmons",
      email: "Brooklyn.S@xyz.com",
      periodStart: "05.05.2025",
      periodEnd: "20.05.2025",
      workouts: 29,
      change: "-2%",
      feedback: 4.1
    },
    {
      gymLocation: "Greyjoy Manor, 16, Kyiv",
      coachName: "Wade Warren",
      email: "Wade.W@xyz.com",
      periodStart: "10.05.2025",
      periodEnd: "25.05.2025",
      workouts: 31,
      change: "+4%",
      feedback: 4.5
    },
    {
      gymLocation: "Greyjoy Manor, 16, Kyiv",
      coachName: "Guy Hawkins",
      email: "Guy.H@xyz.com",
      periodStart: "01.06.2025",
      periodEnd: "15.06.2025",
      workouts: 27,
      change: "-5%",
      feedback: 3.8
    },
    {
      gymLocation: "Greyjoy Manor, 16, Kyiv",
      coachName: "Eleanor Pena",
      email: "Eleanor.P@xyz.com",
      periodStart: "05.06.2025",
      periodEnd: "20.06.2025",
      workouts: 30,
      change: "+1%",
      feedback: 4.2
    },
    {
      gymLocation: "Greyjoy Manor, 16, Kyiv",
      coachName: "Arlene McCoy",
      email: "Arlene.M@xyz.com",
      periodStart: "15.06.2025",
      periodEnd: "30.06.2025",
      workouts: 28,
      change: "-3%",
      feedback: 4.0
    },
    {
      gymLocation: "Greyjoy Manor, 16, Kyiv",
      coachName: "Jane Cooper",
      email: "Jane.C@xyz.com",
      periodStart: "01.07.2025",
      periodEnd: "15.07.2025",
      workouts: 32,
      change: "+6%",
      feedback: 4.4
    },
    {
      gymLocation: "Greyjoy Manor, 16, Kyiv",
      coachName: "Ralph Edwards",
      email: "Ralph.E@xyz.com",
      periodStart: "05.07.2025",
      periodEnd: "20.07.2025",
      workouts: 26,
      change: "-7%",
      feedback: 3.7
    },
    {
      gymLocation: "Greyjoy Manor, 16, Kyiv",
      coachName: "Ronald Richards",
      email: "Ronald.R@xyz.com",
      periodStart: "15.07.2025",
      periodEnd: "30.07.2025",
      workouts: 29,
      change: "-1%",
      feedback: 4.1
    },
    {
      gymLocation: "Greyjoy Manor, 16, Kyiv",
      coachName: "Darlene Robertson",
      email: "Darlene.R@xyz.com",
      periodStart: "01.08.2025",
      periodEnd: "15.08.2025",
      workouts: 33,
      change: "+5%",
      feedback: 4.3
    }
  ];
  
  // Sales Statistics Report Data - 30 entries
  export const salesStatisticsData: ReportDataItem[] = [
    // Hrushevsky Street, 16, Kyiv - 10 teams
    {
      gymLocation: "Hrushevsky Street, 16, Kyiv",
      coachName: "Sales Team A",
      email: "sales.a@xyz.com",
      periodStart: "01.01.2023",
      periodEnd: "15.01.2023",
      workouts: 120,
      change: "+15%",
      feedback: 4.3
    },
    {
      gymLocation: "Hrushevsky Street, 16, Kyiv",
      coachName: "Sales Team D",
      email: "sales.d@xyz.com",
      periodStart: "16.01.2023",
      periodEnd: "31.01.2023",
      workouts: 135,
      change: "+22%",
      feedback: 4.5
    },
    {
      gymLocation: "Hrushevsky Street, 16, Kyiv",
      coachName: "Sales Team G",
      email: "sales.g@xyz.com",
      periodStart: "01.02.2023",
      periodEnd: "15.02.2023",
      workouts: 110,
      change: "+10%",
      feedback: 4.2
    },
    {
      gymLocation: "Hrushevsky Street, 16, Kyiv",
      coachName: "Sales Team J",
      email: "sales.j@xyz.com",
      periodStart: "16.02.2023",
      periodEnd: "28.02.2023",
      workouts: 125,
      change: "+18%",
      feedback: 4.4
    },
    {
      gymLocation: "Hrushevsky Street, 16, Kyiv",
      coachName: "Sales Team M",
      email: "sales.m@xyz.com",
      periodStart: "01.03.2023",
      periodEnd: "15.03.2023",
      workouts: 115,
      change: "+12%",
      feedback: 4.3
    },
    {
      gymLocation: "Hrushevsky Street, 16, Kyiv",
      coachName: "Sales Team P",
      email: "sales.p@xyz.com",
      periodStart: "16.03.2023",
      periodEnd: "31.03.2023",
      workouts: 130,
      change: "+20%",
      feedback: 4.6
    },
    {
      gymLocation: "Hrushevsky Street, 16, Kyiv",
      coachName: "Sales Team S",
      email: "sales.s@xyz.com",
      periodStart: "01.04.2023",
      periodEnd: "15.04.2023",
      workouts: 105,
      change: "+5%",
      feedback: 4.0
    },
    {
      gymLocation: "Hrushevsky Street, 16, Kyiv",
      coachName: "Sales Team V",
      email: "sales.v@xyz.com",
      periodStart: "16.04.2023",
      periodEnd: "30.04.2023",
      workouts: 118,
      change: "+13%",
      feedback: 4.2
    },
    {
      gymLocation: "Hrushevsky Street, 16, Kyiv",
      coachName: "Sales Team Y",
      email: "sales.y@xyz.com",
      periodStart: "01.05.2023",
      periodEnd: "15.05.2023",
      workouts: 122,
      change: "+16%",
      feedback: 4.4
    },
    {
      gymLocation: "Hrushevsky Street, 16, Kyiv",
      coachName: "Sales Team AB",
      email: "sales.ab@xyz.com",
      periodStart: "16.05.2023",
      periodEnd: "31.05.2023",
      workouts: 128,
      change: "+19%",
      feedback: 4.5
    },
    
    // Roosewelt Street, 83, Kyiv - 10 teams
    {
      gymLocation: "Roosewelt Street, 83, Kyiv",
      coachName: "Sales Team B",
      email: "sales.b@xyz.com",
      periodStart: "01.01.2023",
      periodEnd: "15.01.2023",
      workouts: 95,
      change: "+8%",
      feedback: 4.1
    },
    {
      gymLocation: "Roosewelt Street, 83, Kyiv",
      coachName: "Sales Team E",
      email: "sales.e@xyz.com",
      periodStart: "16.01.2023",
      periodEnd: "31.01.2023",
      workouts: 88,
      change: "-7%",
      feedback: 3.8
    },
    {
      gymLocation: "Roosewelt Street, 83, Kyiv",
      coachName: "Sales Team H",
      email: "sales.h@xyz.com",
      periodStart: "01.02.2023",
      periodEnd: "15.02.2023",
      workouts: 102,
      change: "+3%",
      feedback: 4.0
    },
    {
      gymLocation: "Roosewelt Street, 83, Kyiv",
      coachName: "Sales Team K",
      email: "sales.k@xyz.com",
      periodStart: "16.02.2023",
      periodEnd: "28.02.2023",
      workouts: 92,
      change: "-2%",
      feedback: 3.9
    },
    {
      gymLocation: "Roosewelt Street, 83, Kyiv",
      coachName: "Sales Team N",
      email: "sales.n@xyz.com",
      periodStart: "01.03.2023",
      periodEnd: "15.03.2023",
      workouts: 98,
      change: "+1%",
      feedback: 4.0
    },
    {
      gymLocation: "Roosewelt Street, 83, Kyiv",
      coachName: "Sales Team Q",
      email: "sales.q@xyz.com",
      periodStart: "16.03.2023",
      periodEnd: "31.03.2023",
      workouts: 105,
      change: "+5%",
      feedback: 4.2
    },
    {
      gymLocation: "Roosewelt Street, 83, Kyiv",
      coachName: "Sales Team T",
      email: "sales.t@xyz.com",
      periodStart: "01.04.2023",
      periodEnd: "15.04.2023",
      workouts: 90,
      change: "-5%",
      feedback: 3.7
    },
    {
      gymLocation: "Roosewelt Street, 83, Kyiv",
      coachName: "Sales Team W",
      email: "sales.w@xyz.com",
      periodStart: "16.04.2023",
      periodEnd: "30.04.2023",
      workouts: 97,
      change: "+0%",
      feedback: 3.9
    },
    {
      gymLocation: "Roosewelt Street, 83, Kyiv",
      coachName: "Sales Team Z",
      email: "sales.z@xyz.com",
      periodStart: "01.05.2023",
      periodEnd: "15.05.2023",
      workouts: 103,
      change: "+4%",
      feedback: 4.1
    },
    {
      gymLocation: "Roosewelt Street, 83, Kyiv",
      coachName: "Sales Team AC",
      email: "sales.ac@xyz.com",
      periodStart: "16.05.2023",
      periodEnd: "31.05.2023",
      workouts: 99,
      change: "+2%",
      feedback: 4.0
    },
    
    // Greyjoy Manor, 16, Kyiv - 10 teams
    {
      gymLocation: "Greyjoy Manor, 16, Kyiv",
      coachName: "Sales Team C",
      email: "sales.c@xyz.com",
      periodStart: "01.01.2023",
      periodEnd: "15.01.2023",
      workouts: 105,
      change: "-5%",
      feedback: 3.9
    },
    {
      gymLocation: "Greyjoy Manor, 16, Kyiv",
      coachName: "Sales Team F",
      email: "sales.f@xyz.com",
      periodStart: "16.01.2023",
      periodEnd: "31.01.2023",
      workouts: 118,
      change: "+12%",
      feedback: 4.4
    },
    {
      gymLocation: "Greyjoy Manor, 16, Kyiv",
      coachName: "Sales Team I",
      email: "sales.i@xyz.com",
      periodStart: "01.02.2023",
      periodEnd: "15.02.2023",
      workouts: 92,
      change: "-2%",
      feedback: 3.7
    },
    {
      gymLocation: "Greyjoy Manor, 16, Kyiv",
      coachName: "Sales Team L",
      email: "sales.l@xyz.com",
      periodStart: "16.02.2023",
      periodEnd: "28.02.2023",
      workouts: 110,
      change: "+8%",
      feedback: 4.2
    },
    {
      gymLocation: "Greyjoy Manor, 16, Kyiv",
      coachName: "Sales Team O",
      email: "sales.o@xyz.com",
      periodStart: "01.03.2023",
      periodEnd: "15.03.2023",
      workouts: 100,
      change: "+2%",
      feedback: 4.0
    },
    {
      gymLocation: "Greyjoy Manor, 16, Kyiv",
      coachName: "Sales Team R",
      email: "sales.r@xyz.com",
      periodStart: "16.03.2023",
      periodEnd: "31.03.2023",
      workouts: 95,
      change: "-3%",
      feedback: 3.8
    },
    {
      gymLocation: "Greyjoy Manor, 16, Kyiv",
      coachName: "Sales Team U",
      email: "sales.u@xyz.com",
      periodStart: "01.04.2023",
      periodEnd: "15.04.2023",
      workouts: 108,
      change: "+6%",
      feedback: 4.1
    },
    {
      gymLocation: "Greyjoy Manor, 16, Kyiv",
      coachName: "Sales Team X",
      email: "sales.x@xyz.com",
      periodStart: "16.04.2023",
      periodEnd: "30.04.2023",
      workouts: 115,
      change: "+10%",
      feedback: 4.3
    },
    {
      gymLocation: "Greyjoy Manor, 16, Kyiv",
      coachName: "Sales Team AA",
      email: "sales.aa@xyz.com",
      periodStart: "01.05.2023",
      periodEnd: "15.05.2023",
      workouts: 98,
      change: "-1%",
      feedback: 3.9
    },
    {
      gymLocation: "Greyjoy Manor, 16, Kyiv",
      coachName: "Sales Team AD",
      email: "sales.ad@xyz.com",
      periodStart: "16.05.2023",
      periodEnd: "31.05.2023",
      workouts: 112,
      change: "+9%",
      feedback: 4.2
    }
  ];
  
  // Helper function to map dropdown values to gym locations in the data
  const mapGymLocationValue = (value: string): string => {
    const mapping: { [key: string]: string } = {
      "hrushevsky street,16,kyiv": "Hrushevsky Street, 16, Kyiv",
      "roosewelt street,83,kyiv": "Roosewelt Street, 83, Kyiv",
      "greyjoy manor,16,kyiv": "Greyjoy Manor, 16, Kyiv"
    };
    
    return mapping[value] || value;
  };
  
  // Helper function to parse date string in DD.MM.YYYY format
  const parseDate = (dateString: string): Date => {
    const [day, month, year] = dateString.split('.').map(Number);
    return new Date(year, month - 1, day);
  };
  
  // Enhanced filter function with more filtering options
  export const filterReportData = (
    reportType: string,
    gymLocation: string,
    startDate?: Date | null,
    endDate?: Date | null,
    coachNameFilter?: string,
    minWorkouts?: number,
    maxWorkouts?: number,
    minFeedback?: number,
    performanceTrend?: 'positive' | 'negative' | 'all'
  ): Promise<ReportDataItem[]> => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        // Select data source based on report type
        const dataSource = 
          reportType === "coach performance" ? coachPerformanceData : salesStatisticsData;
        
        // Start with all data
        let filteredData = [...dataSource];
        
        // Filter by gym if not 'all'
        if (gymLocation !== "all") {
          const mappedGymLocation = mapGymLocationValue(gymLocation);
          filteredData = filteredData.filter(item => 
            item.gymLocation === mappedGymLocation
          );
        }
        
        // Filter by date range if provided
        if (startDate && endDate) {
          filteredData = filteredData.filter(item => {
            const itemStartDate = parseDate(item.periodStart);
            const itemEndDate = parseDate(item.periodEnd);
            
            // Check if the date ranges overlap
            return !(itemEndDate < startDate || itemStartDate > endDate);
          });
        }
        
        // Filter by coach name if provided
        if (coachNameFilter && coachNameFilter.trim() !== '') {
          const searchTerm = coachNameFilter.toLowerCase().trim();
          filteredData = filteredData.filter(item =>
            item.coachName.toLowerCase().includes(searchTerm) ||
            item.email.toLowerCase().includes(searchTerm)
          );
        }
        
        // Filter by workout/sales count if provided
        if (minWorkouts !== undefined) {
          filteredData = filteredData.filter(item => item.workouts >= minWorkouts);
        }
        
        if (maxWorkouts !== undefined) {
          filteredData = filteredData.filter(item => item.workouts <= maxWorkouts);
        }
        
        // Filter by feedback rating if provided
        if (minFeedback !== undefined) {
          filteredData = filteredData.filter(item => item.feedback >= minFeedback);
        }
        
        // Filter by performance trend if provided
        if (performanceTrend) {
          if (performanceTrend === 'positive') {
            filteredData = filteredData.filter(item => item.change.startsWith('+'));
          } else if (performanceTrend === 'negative') {
            filteredData = filteredData.filter(item => item.change.startsWith('-'));
          }
        }
        
        resolve(filteredData);
      }, 1500); // 1.5 second delay to simulate loading
    });
  };
  
  // Additional helper function to get unique values for filters
  export const getUniqueValues = (field: keyof ReportDataItem, reportType: string): string[] => {
    const dataSource = reportType === "coach performance" ? coachPerformanceData : salesStatisticsData;
    
    const uniqueValues = new Set<string>();
    dataSource.forEach(item => {
      uniqueValues.add(String(item[field]));
    });
    
    return Array.from(uniqueValues).sort();
  };
  
  // Helper function to get min/max values for numeric fields
  export const getNumericRange = (field: 'workouts' | 'feedback', reportType: string): { min: number, max: number } => {
    const dataSource = reportType === "coach performance" ? coachPerformanceData : salesStatisticsData;
    
    const values = dataSource.map(item => item[field]);
    return {
      min: Math.min(...values),
      max: Math.max(...values)
    };
  };