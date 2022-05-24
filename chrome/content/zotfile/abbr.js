/**
 * Zotero.ZotFile.Tablet
 * Functions related to tablet features
 */
 Zotero.ZotFile.Abbr = new function() {

    /**
     * Remove duplicate elements from array
     * @param  {array} x Array
     * @return {array}   Modified array.
     */
     this.ModifyJAbb = function(item) {
        //alert(item.getField('conferenceName'));
        //alert(item.getField('proceedingsTitle'));
        // jname=item.getField('publicationTitle');
        var newabb;
        // alert(item.getType())
        var possible_fields = ['publicationTitle', 'conferenceName', 'proceedingsTitle', 'bookTitle'];

        for (var pf=0; pf<possible_fields.length;pf++){
            jname=item.getField(possible_fields[pf]);
            if (jname){

                abb=item.getField('series');
                var patt=/[ '0-9]/;
                newabb = genJAbb(jname);
                if(!abb||patt.test(abb)){
                    item.setField("series",newabb);
                }
                else{
                        newabb = abb;
                }
                break;
            }
        }

        // if (item.getType()!=4) {
        //     if (jname) newabb = genJAbb(jname);
        //     else{
        //         jname=item.getField('conferenceName');
        //         if (jname) newabb = genJAbb(jname);
        //         else{
        //             jname=item.getField('proceedingsTitle');
        //             if (jname)
        //             newabb = genJAbb(jname);
        //         }
        //     }
        // }
        // else{
        if (item.getType()==4){
            abb=item.getField('journalAbbreviation');
            newabb=genJAbb(jname)
            var patt=/ /;
            if(!abb||patt.test(abb)){
                item.setField("journalAbbreviation",newabb);
            }
            else{
                newabb = abb;
            }
            item.setField("series",newabb);
        }
        if (item.getType()==33){//thesis
            newabb='Thesis';
        }
        // };
        // var no_series_type_list = [33]
        // if (!(item.getType() in no_series_type_list)){
        //     item.setField('series',newabb);
        // }
        //item.setField("series",newabb);
        // if (item.getType()==3) {
        //     alert(item.getField('proceedingsTitle'));
        //     if (jname) return genJAbb(jname);
        //     else{
        //         jname=item.getField('conferenceName');
        //         if (jname) return genJAbb(jname);
        //         else{
        //             jname=item.getField('proceedingsTitle');
        //             return genJAbb(jname);
        //         }
        //     }
        // }
        return newabb
    };
 }

 function get_abbr_map(){
    //var filepath = "/Users/sjxue/Desktop/codes/TOOLS/zotero/abbr_map.json";
    //var data = require(filepath);

    var match = new Array();
    var keyword = new Array();

    var data = {
            "match":
            {
                "nature":"Nature",
                "science":"Science",
                "nature materials":"NatMat",
                "annual review of condensed matter physics":"AnnRevCMP",
                "nature communications":"NatComm",
                "nature physics":"NatPhy",
                "europhysics letters":"EPL",
                "journal of physics: Condensed Matter":"condmat",
                "nano letters":"NanoLett",
                "nature nanotechnology":"NatNano"
            },
            "keyword":
            {
                "icra":"ICRA",
                "iros":"IROS",
                "international conference on robotics and automation":"ICRA",
                "international conference on intelligent robots and systems":"IROS",
                "Advances in neural information processing systems":"NIPS",
                "ICCV":"ICCV",
                "cvpr":"CVPR",
                "aaai":"AAAI",
                "ijcai":"IJCAI",
                "icml":"ICML",
                "ECCV":"ECCV",
                "siggraph":"SIGGRAPH",
                "computer vision and pattern recognition":"CVPR",
                "International Conference on Computer Vision":"ICCV",
                "European Conference on Computer Vision":"ECCV",
                "Conference on Artificial Intelligence":"AAAI",
                "International Joint Conference on Artificial Intelligence":"IJCAI",
                "International Journal of Robotics Research":"IJRR",
                "International Conference on Machine Learning":"ICML",
                "Transactions on Robotics":"T-RO",
                "Journal on Robotics and Automation": "JRA",
                "International journal of Robotics research": "IJRR",
                "ACM Transactions on Graphics": "TOG",
                "Conference on Robot Learning":"CoRL",
            }
        };

    for (key in data["match"]){
        match[key.toLowerCase()] = data["match"][key];
    };
    for (key in data["keyword"]){
        keyword[key.toLowerCase()] = data["keyword"][key];
    };
    return [match, keyword];
}

function genJAbb(Joname) {
    var jabb
    //alert(Joname)
    result = get_abbr_map();
    

    //direct replace lists
    replacedict=result[0]

    //find keyword (subset)
    word_dict=result[1]

    var jnlc=Joname.toLowerCase()
    if(jnlc in replacedict){
        jabb=replacedict[jnlc];
        return jabb;
    }

    for(var word in word_dict){
        var patt=new RegExp(word, "i")
        if (patt.test(jnlc)) return word_dict[word]
    }

    //Annual Review (XXX) ->AnnRevXXX
    var patt=/(Annual Review)/i
    if(patt.test(Joname)){
        jabb=Joname.replace(/Annual Review/i,'');
        jabb='AnnRev'+jabb.replace(/[^A-Z]/g,'')
        return jabb;
    }

    

    //extrat word (except 'of' and 'the')
    var words=Joname.split(' ');
    var newwords=[]
    var jj=0;
    var ignore_list=['ieee', 'and','of','the','on'];
    // ignore_list.includes(words[ii]);
    for(var ii=0;ii<words.length;ii++){
        if(words[ii]&&words[ii]!='IEEE'&&words[ii].toLowerCase()!='of'&&words[ii].toLowerCase()!='the'&&words[ii].toLowerCase()!='and'){
            newwords[jj]=words[ii];
            jj++;
        }
    }
    words=newwords;
    //console.log(words);

    new_Joname=words.join(' ')
    //extract upper letter (if more than 3)
    jabb=new_Joname.replace(/[^A-Z]/g,'');
    if(jabb.length>=3){
        return jabb;
    }


    //Physica
    if(words[0]=='Physica'){
        return words[0]+words[1];
    }

    //arXiv
    var patt=/arXiv/i
    if(patt.test(Joname)){
        return 'arXiv';
    }

    //Nature Science
    if(words.length==1){
        return words[0];
    }

    //NatPhy
    if(words.length>=2){
        jabb='';
        var word;
        for(var iii=0;iii<words.length;iii++){
            word=words[iii];
            if(word.length<=3){
                jabb+=word;
            }
            else{
                jabb+=word[0]+word[1]+word[2];
            }
        }
        return jabb;
    }
    return jabb
}
// function ModifyJAbb(item) {
//     //alert(item.getField('conferenceName'));
//     //alert(item.getField('proceedingsTitle'));
//     // jname=item.getField('publicationTitle');
//     var newabb;
//     alert(item.getType())
//     var possible_fields = ['publicationTitle', 'conferenceName', 'proceedingsTitle', 'bookTitle'];

//     for (var pf=0; pf<possible_fields.length;pf++){
//         jname=item.getField(possible_fields[pf]);
//         if (jname){
//             newabb = genJAbb(jname);
//             break;
//         }
//     }

//     // if (item.getType()!=4) {
//     //     if (jname) newabb = genJAbb(jname);
//     //     else{
//     //         jname=item.getField('conferenceName');
//     //         if (jname) newabb = genJAbb(jname);
//     //         else{
//     //             jname=item.getField('proceedingsTitle');
//     //             if (jname)
//     //             newabb = genJAbb(jname);
//     //         }
//     //     }
//     // }
//     // else{
//     if (item.getType()==4){
//         abb=item.getField('journalAbbreviation');
//         newabb=genJAbb(jname)
//         var patt=/ /;
//         if(!abb||patt.test(abb)){
//             item.setField("journalAbbreviation",newabb);
//         }
//         else{
//             newabb = abb;
//         }
//     }
//     // };
//     item.setField('series',newabb);
//     //item.setField("series",newabb);
//     // if (item.getType()==3) {
//     //     alert(item.getField('proceedingsTitle'));
//     //     if (jname) return genJAbb(jname);
//     //     else{
//     //         jname=item.getField('conferenceName');
//     //         if (jname) return genJAbb(jname);
//     //         else{
//     //             jname=item.getField('proceedingsTitle');
//     //             return genJAbb(jname);
//     //         }
//     //     }
//     // }
    
    
//     return newabb
// }