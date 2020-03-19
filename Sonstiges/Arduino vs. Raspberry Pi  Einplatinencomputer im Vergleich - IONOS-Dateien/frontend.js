/* Optin-Widget - v1.1 - 2018-10-06 - Global Communication Services GmbH  */
;
if (typeof jQuery !== 'undefined') {
    (function($, document, window) {
        "use strict";

        var name = 'gcsOptin';
        var version = 1.1;
        var gcsOptinInstance = null;

        function GcsOptin(opts, el)
        {
            this.$el = $(el);
            this.version = version;
            this.html = {
                'error': '',
                'loading': '<div style="width: 100%;"><div style=" margin: 0 auto; width: 100px; height: 100px; background: 100% url(\'data:image/gif;base64,R0lGODlhZABkAMYAAAQCBISChERCRMTCxCQiJKSipGRiZOTi5BQSFJSSlFRSVNTS1DQyNLSytHRydPTy9AwKDIyKjExKTMzKzCwqLKyqrGxqbOzq7BwaHJyanFxaXNza3Dw6PLy6vHx6fPz6/AQGBISGhERGRMTGxCQmJKSmpGRmZOTm5BQWFJSWlFRWVNTW1DQ2NLS2tHR2dPT29AwODIyOjExOTMzOzCwuLKyurGxubOzu7BweHJyenFxeXNze3Dw+PLy+vHx+fPz+/P///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJBwBAACwAAAAAZABkAAAH/oBAgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0pi8PN7i6uby7vr03L44/tYM/Ey4WysvMzc7MKcSLBzkDJx/FFy4A3N3e3+DeEtiLPRAkEi4dN7U3FuHw8eOMPd0gGCw5F+SxNx4w8QJ2m1cuHAYfM/i90gZCYECCiurBoxHjgLRXNxw4lKcQkUR4EGR06MjqgoOGG79BTPQxHowIFy62uuECYMqBJA21jAdCQ0JYFzzcxEkvJQgePfqpGApgpcehOBbA2sGBqdNDOx3iaJHT1A4NTJt2JZTVIY0eY0VdsIBy6FWd/mEBMFih6kWAtkNFpBW0QwcOvBtVsENVwWbYt4Z+7AhAA8JNEAEenNrBIi43xIc+zPCA4SaOBns1vbAB2G3oQjd6VE4pYQepHxVwWL582tAJE443hqhd6YCCjSAolBZL6YIPwwFxuA4FG3k8GQO2gcPMKGhKHzI7vZCxkcWKHzdIq+R96IaO4d8o0AU1YiOGGYP85aZ9aQd3gZCFefrwTiCEGDIxRJQlP3RAgEMiLNfJDhQ4JMMJhoQ3oCUP+IBeNyjUkF0mOSAg0FYbAkGTY9Q9csKBArmg3yYvGOCQDpIhok1I5CmSgkMcQMjJBgIIBEMDi2gjQ42J7ECCfyN0/tIDivGQEKMiN4CmyQMaCZQDJz/cKFAIqjQnkAGc2OXQAKusUFVANBCZyAMuBoSBgqhcsFRACAyWyQkiCCSDnah8IF08EMB5yQEMCGTDiqkk4Nw3EMCnyQ6yBRQAooShEBAISWmygaUBxaBmJg10BiiQmqzAaTwJfIpJC5HCAwKpmWwqUASqXtKCqCC1sMkGTMLjA6WnVHBqOCCQqckJhQZkw5Oo/BDDfOHA4OidEggkAp+nfGCDj4JSaIJAb64ip0AoMHuJmAJlmsoCq8XDQK2F/JDBhdy4ECIlH4T2QwGLfmODkr2GQwG2lowwwb2DPNBfQAUs2GNAMNSwSQYi/syAMBArtOrqBNp9qyfBlCQAggBSJRKBQzzoyImw4JYAryBasrBAThto7CuwmDDoUGuZaAmACBN09IIL9AKAAlf7besjgJgkYI8IJQvyQQM2hyPCAaAsUDQAmMLrMzcySzMDDw7BwPQnL8wpEANBW/I1NwIkdMFvZnXLSQP9fgOCBBZX4jQ4IjTgsUMhXIzJCWA5tPd6k7zNDQgobA0ADiqH0sORG5HQgbmO/G0ZBDm8zMgLHkg+eQRYR+L4UDKkTsoB7ZYtAlqQeB4WAS0YzkkPHt6EgAYt7NOI7UOZLfojLygaFg/GLkL8TQbgPMqMYXHJyOooM57KAYkPZf0i1tgHxMIIuodygwymc/O9jUyRwPErOxgA7ZaNhD8R+a98sMNJKa2fiP3EksDBYPGAGOTtG/5DBADhwYMFlG8UH2iBAIqWwEMsEB4c6NsrfrACDwwLHBU0xAXhAbQHjuIFLZAAekJYiBEGMGoEbIEIPggAFhLChfBggANn8QDBsaAtNhwEDuEhgAHycAEZMEFjggiz2diDb8fbxAducIARbKARI/CBFrfIxS5q0QMuAKMYXRCAGkivGGhMoxrXyMY2uvGNcIyjHOdIxzra8Y54zKMe9/jGQAAAIfkECQcAQAAsAAAAAGQAZAAAB/6AQIKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJonNz+doqOHDQYlJ6SqozMkGCwZB6GrtJcPLgC5KBY9Fx+1wJE/DTi5uRAqGQsvwc2MFxLGxjAcLhPMztmFHykw0sYgGDIdN7/a2gcU3+ssESMP584/Huv1JA41vvHAMyD19Th4ZLiwj9YLHf/+gSDg4l3BUT8qeEv4D0aDh6M28KCYcAZGTj9ulKDBsZ4IbB8vfdiRgUPJeiAqzEpZ6UEOERBe1uOxgWalHysMYNAJ0wdKRS/M+RRkkyTRehRGNHpgIMaFmSlPePD3tJ4OeIxGUICgY4bShz82mMjZdZ3FRv4fQvgDwWNAyg0KuLb9RgPsoh3RjOFYgHYHg73/MsAtsQ5Hi7PZNqhADLAnoxcKoHbA2uyCBbaUpdk4mmjBRHaWnb3woVcnDNDfULTgfOgDroQq/AarALskCRsjfPxTQZDRDgIUQQTQTcswUQQ6BjDbcHpaCtqGuCHgiKMGZFIvbLSmiCNHKkEfEH6jkFrRhcwlZRyoFXFoSRAsVkBuMN4HdkM9IPdSCN91cgB8HIGgQnuDHCCDNBAwmIhW1SWEww6rRFThPwqsgN0LEeglw3+H3EDPSx4UqMkLAryUH4kzHJZLBZHcoB5HJEi4yQgvYeCRIh+Y4I8IGEZyQGAUQf5A4CgfGFASDCmoSMgIr0VAWiPDFMORAEV2sgMJ8c13GQ80TEDJauOtg0IDUlaSw3bkzeZIBQZc+cgJAlLkgp2WPHBjQl898sCPlSRQEgfnbbJBixTB0IIwl6yQ5z8QmMlJB1omRMEN2bzgQEk5cMJNSSFooyFHJnCyWkl2abMCCxwx0GaNTpLXpTM3aMARDJxqcgGjCSnQazYf2LCrmJkc4FRCo8WTwIYQEorJDpn+s+Q5JaCQZA+KaktRBLOq0oB9Cj2qiWkcxRAuKS2QWw8ENWyygrcJqRtPA/S+a24mx3EUAJ+1ZJtcq8ku+0+zpkbQ2zcwSHvJBQ9SJMGwzv4Ue+wmN5jAEQa3djYZRSgwZ8kLAZTErTYLwEoRC+s68kEGaX7jgqklLPyNDZ0EyNGm2TxgQUkFeAlsRfFeQuIhK7j7rqWbHBQfxZJcQDAjH0RQEg+JblICnAlhUELLhvwQQaCNJF2SUaIcACZHEnT8yAUMlDmVeByteTQlH/y8awx3IyKRkrN+UMOk/4iAbCf93DcA2ILcAB8Pbhcyw0a7JsA4JB8gSBEDI/RNSAdrg1ACiRC/REPkm9SQr0IyLNAymsYooOIFGr8UgeeVXPBxghLoeMgGKucCgo4nrNXj4aT0sHZJJTiSwjoOYPXBBEhyBEEOl09yS8zf5NjIC/6US0NClyIFH2YwB5j/jwMAE7JAPVD+8MEMJihNEQFyBtMD1wB18L3e6xBAAxwArYRAKXsjiwH/vkGcRrQiNOswgMhqcQEH2AwGOehb1WyGGC7F4wC7Ex/yEOEgCEqDBZ3bxwNkMJ5SMeIHJShgW3jgsHNsQAeggYHvCnGDWpmQBTU8xw924ACuaKB9g1jA6hAjAqZ95AHPAkHRGBECE8LABjvAXTM+0AIfZC0RFyBcW0iQASTu4wNJaUQBZPik6CBwKSukDA0qcII3LqUFYiwJAniQg3IspSbG6goIUlCcP1ZiATJ6CgicaMhJiIV7etJiI0tUAwngAJKN2eEkHXDxgA64QH0JgQC4NnmJF6wgATzAZC4k8EVSTuIHDxiBAS6ZEBTIxJWZ+MACQiCCAppggricxAcOkAMdLBEHQQwmJUIyAR8oLQLKFMUFbqIlAkAtmpl4QAtMQAN4YXMUg0pBBID5TZWAopzoTKc6GxkIACH5BAkHAEAALAAAAABkAGQAAAf+gECCg4SFhoeIiYU/H4qOj5CRkpOHNxMPlJmam5yCBzoZL52jpKWeIjA5jaasrZAHIgAQGZiutreDsAAAKCmiuMCsursYGT/ByKPDuwA5v8nQk8u7CLTR16+xzLsoodjfiNPMqavg5kDizCDW5+DpzL217dfv8Bnl860/LzcnGzMTepSgsa3gLhDO8pn6cGJCgQAGeBAAYbAiMwQp5CnU9GKCDwU0IFgcWRCDr42UfjyoIAGHSJIwt6HIcQzlow87MhCMydNgDo02DT3IIeJlz6PcMgY19GOBDhRIozLD0KLmUiBDaVCUGhWEhhNXBZ1wYZQrUh1gr/7YYKKs2Z7+KtJe3aBg69ujCnaEXcviLlIQaMMC2aDCLwAQdkkGDnvCQuKjMETYiJGhQAwSMBUcEPzAh9uYkUtsuPDiw48fBwSQVKF3b4nPJEnYmIBv0A5tFReH3cDgKAIdI54ZqqfiAqUXF6wGe2HhKI4ccsPh3paX0occBjYj+1EBA08QPFYol14QcHRIL1JQDFHb1gEZ3zVsiCROd6QHGRDswqEdF3cYMYGggnj0TafAeY+8kAFUzAQwXisvTDcSCxu0l8gyrFmXX0EUrADMADxhsAAlt+1iH3o5VAQBe7d8YABoCTzoiC5xUfJACgwaJEJrruyAWWYIPgJLhpNc551FKNT+IOMoGQBIEg5VZXJCDv1JUsFjBrkgXCkP6BCTDkBFso8mCcTEQZCdbMADTDB08M0KBMAEwgSudIADTDSEicwLNsRUQCsfqAdTBOD8B5MJEPoQ0wjmzNAXSQxYuMkNLz5Z5TUXFEYSDDewcoFqJCnQKTh8snlpJzvsNJIDW14TA2zMQDCiKTvcSRKL5hSQY0UgDMDKCvqRFIOkydRwpEUQuGkKsDAlQCwyLRzLawu/BjvSsOc0sKtBybKyga0j4QpOCduWx6gpB6hqkQ2tQvNBBE5aBMOspVwgoUESjPpNqZueyskNJsCEA4/YXKAATCjouckLAcTkKziOwsTCs9b+pRCTB+BcByszLrjSQ5wkUaBvNA8EDFMJrmwA6kgwNPCmtBXBQCeEXsKkgsKKPNDuIz+EEJMAaHZSQbkyJbBzIifYELQiGxBdkA9Hc+IjyxFEfcgBNsCwNCIPOIBlSVG68kFzMYcwMiQ32KDf1oZ80AC4I4ngbykzYIlCAjgjcgHZALBdyAwcwLgkKS8cvA0MeFOCtV1+5wJfTDTMbUoN1sIQgtWGJB1v35JcUGlMIQxer6aWn/3IAxa41fgJBnxtEAmNd9IDCXdjXkhjFbH9wQgS9AQBTck8EIDRitsA29Y3lPAoTypI7soNthNyQdYWBf3DBCbATBIBHYg+zwX+bY2E4AeWOACD6zGfFNbiJG22zw07dBCDDJv3ZED04GgOkw8R+GCBDgKAG1JEMJ+wPMB4MYEABNDXExaMwHvnwJ1hesIDei0Faxub4DZYMAPBTK9+GqyICGZ2lRs4JoSbssAOIGiOCzgAhbEpAP7AsYPHwbAgMDDAACiWj6ao64YsqMAJWKiQGfCAgVxBAA9ykBzBHOJ69zILCCiggBIYx4mJ2N2a7oIDHaRgBDfgoROb0psAweCMKGCBAVLQgx2EEYuTmIEAkNiADRyANESE4yF2t7Lq6dEU11te7v7ICiOKj5CAnEAUOYfIUmhxkI0shQ8NErtIPkKOiamkJRUp8YMR9FGTm0zEDyK2C1CGEhEfAFwpT5nIOZqSlXv05CthyZQF5O0agQAAIfkECQcAQAAsAAAAAGQAZAAAB/6AQIKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2ehD8fn6OkQD8zO6WqnA8uKaKrsZYTJBwnsriSPxEAAA25wI43NL0qsMHIhz29ABgzydCELwrMIB4v0dEjOMwALBvZyR8uEN0wGT/hkz8vNycbMyMDPQMTExsnFy/phQs83cUuqHv04cSEAgEMcMAAAmAzFhp8ZBhwABuQDxnKAUTQYyCjByN8KKCh0aFJECREOOhw44IMkwBseET040YFCThKwtwJAAQGFgZ0mrsxk9CHDRmI8VzKFGAKfjMf5BAgtKlVmAIEevyxQAeGq2CXovg1UCqFhmHTwtRBNNwBF/5q48IkMSDbjxUG0Mrd2wtEBIvJNsioyjcui1vI7rIozJhZhcDU+IKAoJevBMC4TpggzBSGyhgZSlQokSOBCxko5CJ4luuBD847YcgoseHCgw+hcn9ot6OGjtRhQTjArOpHgcpMKdiYQFwRRhhpGSzAtYHBVRQ6RjRf9MIG8qYiJsh6YeIqjgJaIy3gABYEjxw7tnv6UeErUxACVkCF9CLGd5MQ4ODADPvgcsBL96mQCiUnSMAUCiJEsMIxsvxQAnRLgaCBfpV0ABsAKJhQwQkU4vKACE19UyIkHxgAEwgEhLDADSviMkBTOExnyQ7fETBbW9G8oENnGdT4yC56gf7Agg09PDDQBhQwpcIBl5zAXi88ZLCCkx6lgOFOOHRgpCM/5IABCSb0QGNRDwy5lA5cVvJCAj5sMGY2G/zDEwwdYNLOneG0wA1PLMRZFCcfJMBUDId+sANrmrzgAVMjzPTCBCFIwAGgkNzgIk8ELBjOCz0YQENDCACJyQl67qSAqsGws0MBHCBgDpWaHKDUTsOJc0MHHkTpEASQYrKBfTuFwOkoC5gwKIB1abKCrTzFsOwnLSB7Up/SfglTAtd60sCzALawybRLWZtMDdo6BAK3mexA7kYGzLBfLiVQCxME0Wai67Ak+LBluJ18EMKHEKywyQUoMoPDbBfcG8wLFv4sBQNimdxQnjcutJBeNheoIJahl7wQAAsJbDnTDIvxtCkrtxVV5ocAOHDoJw98ylMJNw/yQ0WYrABcbMVu9cIMHmgAqyQGMyUAxgO9sEEJGvQE7iVCMxWAfMhc6oMAGFJQqSUPeCdWAxJ33YEOp3bDliX0zWuSBFAj88AKOXBQ1VgEGzLDlXvGkHYsP1zQgwMk7CTCx5KcgOBSDIiay88ZKEDAUk9VcsHGTIUwOCkfrBACDfrGxjgkJ+TVFAl1l+JoAzp4u5QLlHwwgoNNQZDD54jOkCnNG40dyQ0ltNyUCq2PcgMPwDukwumL/DCBAe3yRIKYsnzgZlgWAM3IB/43TGABDP/BBEMCXH/SQ/lL8RBBCyvcUKAgH4C/Qw8RyCB7Uyak/wnDckEBBzRgAR9EIAYR8IAJNCAAuVlFBJLLXgwYMxkIUIYvLJgA70ixAOM1Zi880FHXHMC+D6ZIYdHIlgnjIoKi2a1hK7wKDBywgw3KogYxvAoJCuC/XNzAgTk0hwFG0LdV+CCIO2HAiGwYjAkAsScfRMB7bsBEZGjsRSYwAQtKmCEKqKAE0JuJcYbWDQKc4AELyIAJGMBFgJBABykYwdJ6dgABmMQD/ADfAUaQAxvwAAMwCCQEAgmDn5ggBT3YwZp6dgiDCQUGLhzEbm5wgB1sYAcH0EcVGU+5gXm9jZGg0xkAYFCATYJyEiPQCwRPWYobIAgEASgiKwmSgYYQIJKz3EQHAaADWebSEZKCgHh+SYpS9ZCYlbibKZEZCV8y85nQjKY0EREIACH5BAkHAD8ALAAAAABkAGQAhQQCBISGhERCRMTGxCQiJKSmpGRiZOTm5BQSFJSWlFRSVNTW1DQyNLS2tHRydPT29AwKDIyOjExKTMzOzCwqLKyurGxqbOzu7BwaHJyenFxaXNze3Dw6PLy+vHx6fPz+/AQGBIyKjERGRMzKzCQmJKyqrGRmZOzq7BQWFJyanFRWVNza3DQ2NLy6vHR2dPz6/AwODJSSlExOTNTS1CwuLLSytGxubPTy9BweHKSipFxeXOTi5Dw+PMTCxHx+fP///wb+wJ9wSCwaj8ikcslsOp/QqHRKrVqv2Kx2y+16v+CweEwum8/otHrNbrvf8Lh8Tq8vP4/LYTUZ9Do9AxMLBycPL3ZaLwcDOT46AiggAJSUICgcKh4pHTsPVzdzNwM+MjQQlamqlSAEIg4NF1QHCR9vHxclIgSTq76/mAkHiE87BhLEay8rCTS/z9CUOD4TyUorKgACtms3KQK90eK+DBE71kYH2drcaB8zOijj878QMi3oQwcGldtp3iTC0RuYCkaAC+g2aEjl78wOFwIJSrRkYESyDev6tRvzYYGBiBMnguDRQcgBHasaklkhA1XIl6lwzNjnS2WYDysYwNxZkML+L5tgFijgCQECSJ4axxywcFQcDBEuImQoUaFAhhguZOBAmjTMDQ9Nf4GAIaPCghM3XnxA9GFtng0VDOAISw8olw8FXM6jYGNGviQvNoQ4BdPulhXO5qHQMeCTlBcTfGwNaTjLDRN0YxY4AaoFC8obt7woMDkaCAErQlfZYQKGxMpXdsgYB0LDhi4nPLgeCLsK3t3Qai9QjWUCAYK9qdwQMI5Fai87dGROSfxKh3Eyv2wY+rp6lRcoo8FI8ffKgYUTk0tZQUKcih1eTk7/6X3KhwQIouHA10Vh4fpS3IAeNDqEwsUO3L2kHhQr8CBeSVycxNOCTzQwFwgYZqghBwb+arGPXiGBIAKAURzQQQsopqhiCwtw8UIPIQQQgYw0xlgjjTPeOGMJJCbi449ABinkkEQWaeSRSCap5JJMNunkk1Bm8UIDOlRp5ZVYZnmlCTmUZ98MGWSQgphkjjnmDFw8EAJRKqzAxQUmiFOAiwHsBIICM/T4xAIYiDdBmmvCJMMGejrxQp3RCHAAnS/duWgXC8gTTQCOaaFmiCq02MUNTEWDQQ1dHBqSAsOFWkJpz4jw6BaXEgSCDKtyMQEHTsVQqKGI0nPnbV6cIME4NMDXRav0oMBjfPyME8GtuLoqgaZbGDMfCbGyGihBFDRQqRUvDPDrODDkwGyzE+EQAq/+VVyQg07zvAcGsRI91YGXSrwwggGSjkMCf1+IChMCKrQwTBN5DGABDPNRMt62w167Ewch1LDABYfYolYeK7QQgQz5EWQCw6HmihQmGpjgQQAxemCBCgKgOpAI6L7rMFeWFAViSCxYNIa/qogoQsI0+8IDmmTAa0mbK+hwc9DNQbuzyJSokOcHGzgANNMi/GmG0TKcM8QFCQDH9DMwuLDDuN/l6qgRU4Iz9i80ZEDvF62CkClxy/iQ79sAwGDCAHP3i6gMK9B7QwMSXD0QCxWcEDjdIbzKWRM3tCDD3juhwEMOJ6CtSAQqxEx5DSawoHgqIFCgQgmTuwHZAo8b8cBKAinYwMDVJOiQwACyyKEWtzdsMEAGNoiAAQzIF4U8BhyYwMkGaUWJxAt5HLDDAhsccMMDnkvv/ffghy/++OSXb/756Kev/vrgBwEAIfkECQcAQAAsAAAAAGQAZAAAB/6AQIKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLWLPy83BxsTIz09AwMzGwc3Dx+2mh8nExk+GiwYIADU1CAYDCoeGT0HL8mUDyMeMhTT1ejp1iQiDi0X4I4/NxUiBOfq+erXDCknyPEOfdiQgoK+gwipYfAxAWBAQQ8yCICQsOJBChF2/Aj4Y4YOBBZD6oMhoYXDWhENilyZD0aECxtpHbCBj6XNaiBUzDjp6scCHRRvCsXJoYesFTKCDl0KAMeMVz9WMGBKlRoOk602yKAKAoTSoTQ68DR1wEBNkQhEuIiRo0aFEv45EnhQgEMojRWqHrj4WhEEDBk1Vtz48OEHsh+Gc+1oYADH2YoqbqD6kYNvQhoOdj76sCMGg8cHQfj4ZupHDBIhUegYQTrShxk+6oYkUCNmqQcTYtBIiKMEPEsPevAQKeFAo8KafjxoQfcsCAEbbF86YMKyvhBjBy3r4MM4pxcTXHAICkLDjk4XfMCwiOO8oRcrUsiAYaH19xUZVMDQEN3TDR8h+SDdByM4MB4ACNQWygc3THCAdJzcYIBFFOD1wQUNKCBNNRK499AiO0hQEQQuDBCDSujAEEN2HxbyQwsEVISAbOpU2GIjD3gAWkg2sHhjISfEeBMET/3YSAJCif7go5GEzACSTQUwqYhyPSiwI0IMbFDJCz00cMCSpCg3g2dCgRCAfZHswAICMiSwApignNCADVMNRcIAltRwDgQM2KBZKcsUIAKNQ0VWyQcCpAMCmxV4I8oJIZBgnU0JWjLCpAAwEMMIkn1yQAQiYFAVC51O8oENFVGgQw03QJjJMjWYQOhNKVgiVWoC+POJciNEgNpNKHgoyQchYDqSAz1cAOckL9Qgg5AiubAsIgeIeBMCKmSww7SRPDCADSwYWw0KWE3yQw1PCgUDDy409MkLC8hXkQzeMWtBVSCgYMCfnTDYgQEbqgNDCtwassF6VKHAQQz9LbhDCDygkA4Lwv5KEgJVGOhQgEamfHBAASaISo0DBRdyQZ1C4VBiq6rMM4AHOMBQpLk5IMwSCgJUoCws87hLyQ0K2JRTB6VKeUgHv64EQZRGJ/KCjjfJUHTThKyw200YlFByQDks1SHVhXwwXD4YQHsQBBG4avQAZyHAQg4HjHAlTj1sDYnanbwwYTU0mNBApx+oYBEDI+CNyQE5zIBmJzMYBAIPAYzwQCHo9iXBDIZXcoIBfNrQw+SeEAuDAjU4asgFgvclAl6clIUPDiL4lrkkNzSwwOw9JJ0QCS0sbuoIIuiDQQgDDJYcjlBbhEFGl9xQAMr64GBAAf+ccgALIsEgQAe+M/LDBP46SGyRvieg0kO6Fv3VwD9wXjiCBTDMnQ4MGdi9ZQLoh8RCCLZf8AJyhcnFBloQgfnYxATdE8UFbGCzlbhNBRZwQQgiEAIPWEAFAhCZTURQMevpgCoQCKH8KsICfuVFBiOsSkJ4wDpX7IBzKhQKC1rYkx24IIUxRIcMZhaLB6SggTk8CAwcwDFafKAFIhBXDEmgNXD8YAMe0GAQqwEDE4zAfqd4QQtQOEVqsKAGMLlRcCSAAhxWBAU8KMAxpLQcGxyoTDRQQQWmxsYV5IBOZgQACQyQggnQkWrK2cEEcuACAcQMBohMJAE4YIIcDGAHxgMbIz6QixMcYAcHOMENXhswO0l68pOgDKUoR0nKUprylKhMpSpXycpRBgIAIfkECQcAPwAsAAAAAGQAZACFBAIEhIKExMLEREJEJCIkpKKk5OLkZGJkFBIUlJKU1NLUVFJUNDI0tLK09PL0dHJ0DAoMjIqMzMrMTEpMLCosrKqs7OrsHBocnJqc3NrcXFpcPDo8vLq8/Pr8fHp8bG5sBAYEhIaExMbEREZEJCYkpKak5ObkZGZkFBYUlJaU1NbUVFZUNDY0tLa09Pb0dHZ0DA4MjI6MzM7MTE5MLC4srK6s7O7sHB4cnJ6c3N7cXF5cPD48vL68/P78fH58////Bv7An3BILBqPyKRyyWw6n9CodEqtWq/YrHbL7Xq/4LB4TC6bz+i0es1uu9/wuHxOry97LpspIxMJODwCEioGFi4ddlodJiI4HjobCCAAlJUoDDMeKRw5iIlTDiIeMxQQlaeopzcTHy0Wn049FgUjN6apuLmXKSaesEYdKikUucXGlBcvMr6/PzYYO7fH07g0ETk9zS4fCNTeuRATLcx2HTwo3+mpMCEW2bANBOrzlCAaEuR0LhUk9PMgOzj8clEDnT91N2Q0E3DhIMJxsDrU6GcMAoxJDgFQgPhp3w1UKEa8iIGjQo0SBRKM+kiPhYpfHVqgAIFgRgUVNjp06JFtp/6LPDlanLiB8dsMG804KMuXpIOBCDSkTQMRwIGZHgIyROnBlEkHBT5YUrtQoSuXHjw2DMhxxkFao2zF9GhADMAGCe/KmPgg1VgAs1jQ1qW0QwIaEz5gULsR10sPDixSsWhcxkYAbx4AU+kAOdcOFXnJ2DhAjYTWsy0G47qrmUuOGdMg+Gj9BC2NaTsUnOFM0dhaLWg3eNtBeYwLH0V11Qi9ucXtbxuWmTHRu9gLF1ceqx5u2EyCaRtMWHkcmd6Gl2UyyKvYfQra8v52nB7j4MO0AlTmbjcvgrnjCooZc4J7POwXn0JjqCCcMTTQRsRjC2ZUyQbFeWHBCscggNQTMf4xIGEquTk4hQsPHAODAbVxYOCHhYkoRQwBgoMgE+R9WMx5YZTQTTEgCNBEDxJMgAICRBZpZIw8wjCkkUQOuQKKXzRgEDgtONHBIT9lqWUHIiCJS1Vahnmli0P0wIcEMqCpZpoyRDAlLiBEsOacbELJhAo7FhODf1m4gAENF6AQ6KCCouAlnIQmKugGVTaRg1i5BIDdFzaEkKeNqpQwKRMGeGjMB5t64UAEh354QQ0imjDBMRNsCEYHEVz64Q0NROEAacZcUGEXlb6ZEQklkHncNDyIFkCp81ygqRQ9YJAcLi+U4UICyH5zQQt8NsHDesVQ4KoYLgTgazoElGBFDv4DmFiDGZXK6k25oUrhgg7THGWGAyFUm8up8U5RwrggBWtGBzG4W8wNjWJhQHW5TLArGL2WJnAWHdh3DAh7nmFBvsfcUIJVW8jwLJwcZPuFAwn0dcq1ZHqF4TQ04LNbCAATsG6UBqMCwgQymGwhzajAC4YJ9E41gG5nVBqjsv1ywQPDxZDQQtOvFgzAtWS44MHI+4ZgJxkOBLBDCT5vYUCE08AQENV3kGmBCmx7wUPOuSCwQAO9tOaCBSJ84MErESUA8DEshNCAAobs9INPNmTQQgQTKAbDA+LBYsELKlODAAsrnPBCACGE4MEBGuzQ0CmTf2uHCRpICAIEEHBdCcIMHsQNhwMryI4pJRB8UPknOZygL6aTA55IDwZgvnsxk9v+BsrD2wiBB6rX0UMLA+iOKQQvGH98Bj6cvjzqL/wOiwstLKC9Qyw0kFMzQ7jAwwwXrP8NCjtUUD38PzjQwgcssB+PaKCBCniPf0ZwgQpw8AEGCLAeJDgBBkSwPwQCwwEGEEEBHjACEsDggyCEwQ128IEJ5sABzrNgU2xggRzkwAAmQGHLVEjDGtrwhjjMoQ53yMMe+vCHQAyiEIdIxCoEAQAh+QQJBwBAACwAAAAAZABkAAAH/oBAgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tYwfNycbEyM9vgMzKwcXLx+2nicuHCgAzc4ACDQKLikdO8bHmTcGz93dOAI2DRfZlx8FCN7qzigMCSfY5ZInIuv2zRgeM/Hyjj8RIO7doxBixw95D1a8aLSBmUB7EES04Bfrx4MdKVgQGNDog4mHAmEEOHEQ1o8LDRwQcOaAIqIREEDeA6FigktUP3Zk0OCQ3YlGF2TIFMiiB6sfG3xQSKeuQMcUQwXimIDqw4ESKmLeY3Gj0QoeUe9haLBw1IsREUQEfIiiQaMX/h5gwICwNuwzGhNDPehhgIZWmSYeMGxQo0KOFB5U4LDbjMEKT1ZzCOgZlQZVSD8+vLhxoIUJHHVlyuiq6UIHHyQYPwtRltKPAzEY/H0IwofgSycKKFbdjccBTB9W+FgsE0OFm5BOxMDAuxsIt5le9BAwVMQO4AdS8KCsWkJrTCcszL4XALmkBw00kAgdFsYMThd8wACJ4fqmG2hZ8HZhftINHzL5UNImH+xQgQzzhcXCBp3c8NFDFCwAygcx2AVDCv1NcoAM7HlTW4aUfKADYwr8xMkPHaQmkAD2dbKDimEh0IInL/jQYTco1DCgJj9kkKBdFnxXGgUPuSAkJg9o/kDbjfV9AhVRv3GyAVj3QBBCAPp5k8AnG6xU5QidtECcPSw88MIOBfAQGgOkcfKCAw/lwMkHT94TAyEfTGABCfPBUMGOmXxQw4/rGOAmgAJxVMgLC0QgAwo6tLnJAhwIxACIj2wjVZSGvHBCBRFI2KAKIUl6yQXU3aOAqYX8UAyNcN4DA6eYHECDQA4caUoMhHoDwXua7DDmOiFg+kkF3DlnlCYrMGVPDMZ60gBzEM3IrLPrQMtKC9SuA0INmzQkkLarNJDsMxBYm8kGw6oTgK6llHCuMyAsm8kJWdpjA7yj/DNeN+5tcoEEAonAKnDXKPKCBSHReommYrW4yQsB/ngwwG2GXKCAQChgjAnFD9nLSQUgkKBAB0fOkO86LETLSI9FfnIBkQCAQEMMCzxw0Dk3PuNCJz14aQ8FB1/yQgjfONDAAQ4+VIKLqUIEricDCO0MBiJ40O06MFw2MTcCjebJBWB7+JAAJo48LzsFuOxICVtH5QO/lexA8z3WjU1lWBi0AGigNjxk5d/mAGSXCA5vskLPz4DQAeGWHLC2PTLM4DGBGz9EwwiQV8KwXSS40MEFbjNiLkgSzND5JD30OhQBMmRA0iYnjEibAMCWJhRvMDAQwAZ0Q9IDjAIR0MLllXyQw792QaBCAwlb8oEHjHeDQUGaUNocuhpMsHoj/gfs/RAMPKD8sQPVywSBCRXAg0kP2I4vQQPwlD7ICO1GBQMNPizwwvePoNPkWBaCGiyAGB/ITGbeQiq74EAEJbgAACVxAxcw7yEIYIEKTOCAAFwpL4xoQVho4IEWFE0TJygbb0BAFxGQgxE3uBtRYqCQUrwgK9tzxtQW8YMEzIQAOhiB/SJnAteRKHiCmAHxnAEDAfhgBkj8RE6ol0MUiGoRTXsGDDSQg+i14gEpMGJUQOABEP2gBswpmQtmcIMJlgJFIrigTBbUiBRKIAezqwVShsO7DJhxBy8sxws6oID02UMFgeyHI14wABlgwJDdQEAHFCmJF7TABhyQozpsSzDEfrxgBTmwAQsgiYG0UTISFjnABArgAhngQC6wlAs4bJC4U4boASc4wAEAaSY32vKXwAymMIdJzGIa85jITKYyl8nMZjrzmasIBAA7dndMZEVWUERKbEhDOGt4ejJ3V3diMU1LbnowemJVc1FZUWkxbUUvQ1BaRG16Y3owcTBOeHVhaFdmeHNScDkzQg==\');"></div></div>'
            };
            if (gcsOptinInstance && this.$el.length === 0) {
                return gcsOptinInstance;
            }

            var firstInstance = this.$el.data(name);
            if (jQuery.type(firstInstance) == 'object' && 'constructor' in firstInstance) {
                if ('version' in firstInstance && firstInstance.version >= this.version) {
                    return this.$el.data(name);
                }
                firstInstance.destroy();
            }
            this.$el.data(name, this);

            this.defaults = {
                'ajax': 'jsonp',
                'loadingbar': true,
                'preface': null,
                'host': '',
                'https': true,
                'mode': this.$el.length === 0 ? 'headless' : 'full',
                'skipKnownUser': false,
                'text': {},
                'callback': null,
                'fireEvents': false
            };

            var data = {};
            if (this.$el.length) {
                $.each(this.$el.data(), function(attr, value) {
                    if (attr.indexOf(name) === 0 && attr.length > name.length) {
                        attr = attr.slice(name.length);
                        attr = attr.slice(0, 1).toLowerCase() + attr.slice(1);
                        if (attr !== 'opts') {
                            data[attr] = value;
                        }
                    }
                });
            }

            var meta = this.$el.data(name + '-opts');
            this.opts = $.extend(this.defaults, opts, meta, data);

            if (!this.opts.host) {
                throw 'Option "host" is not defined';
            }

            if (!this.opts.id) {
                throw 'Option "id" is not defined';
            }

            if (this.isHeadless()) {
                gcsOptinInstance = this;
            } else {
                this.init();
                this.apiBootstrap();
            }

            return this;
        }

        GcsOptin.prototype.apiBootstrap = function() {
            var preface = this.opts.preface !== null ? {preface: this.opts.preface} : {};
            var light = this.opts.lightcheckboxid !== null && this.opts.mode === 'light' ? {lightcheckboxid: this.opts.lightcheckboxid} : {};
            var opts = {
                mode: this.opts.mode,
                skipKnownUser: this.opts.skipKnownUser
            };

            if (this.opts.skipKnownUser && this.getCookie('profile')) {
                this.setCookie('profile', this.getCookie('profile'), 90);
                this.$el.empty();
            } else {
                this.request('GET', $.extend({}, opts, light, preface), function() {
                    this.fire('init');
                }.bind(this));
            }

        };

        GcsOptin.prototype.callCallback = function() {
            if (this.opts.callback && window[this.opts.callback] && typeof window[this.opts.callback] === 'function') {
                window[this.opts.callback](this.$el[0]);
            }
        }

        GcsOptin.prototype.request = function(rType, rData, rDone, rFail) {
            if (!this.isHeadless()) {
                this.fire('loading');
                this.$el.css('height', this.$el.height());

                this.$loading.show();
                this.$body.hide();
                this.$message.hide();
            }

            var defaultData = {
                version: this.version,
                opts: this.opts
            };
            var data = $.extend(true, defaultData, rData);
            if (rType !== 'GET') {
                data['_token'] = $(this.$el.find('[name=_token]')[0]).val();
                data['_method'] = rType;
                data['_width'] = $(document).width();
            }
            data['_referer'] = window.location.href;

            var instance = this
            $.ajax({
                type: rType,
                url: 'http' + (this.opts.https ? 's' : '') + '://' + this.opts.host + '/api/' + this.opts.id,
                data: data,
                timeout: 10000,
                context: this.$el,
                dataType: this.opts.ajax
            }).done(function(data, textStatus, jqXHR) {
                var optin = this.data(name) || gcsOptinInstance;
                optin.fire('loaded');
                if ('messages' in data && 'error' in data.messages && jQuery.isArray(data.messages.error) && data.messages.error.length) {
                    optin.fire('fail');
                } else {
                    optin.fire('success');
                }
                if (!optin.isHeadless()) {
                    optin.$el.css('height', '');
                    optin.renderResponse(data);
                }
                if ($.isFunction(rDone)) {
                    rDone(data, textStatus, jqXHR);
                }

                instance.callCallback();
            }).fail(function(jqXHR, textStatus, errorThrown) {
                var optin = this.data(name) || gcsOptinInstance;
                optin.fire('loaded');
                optin.fire('fail');
                if (!optin.isHeadless()) {
                    optin.$el.css('height', '');
                    optin.$error.show();
                    optin.$message.hide();
                    optin.$body.hide();
                    optin.$loading.hide();
                }
                if ($.isFunction(rFail)) {
                    rFail(jqXHR, textStatus, errorThrown);
                }
                instance.callCallback();
            });
        };

        GcsOptin.prototype.renderResponse = function(json) {
            var optin = this;
            if ('opts' in json) {
                $.each(json.opts, function(index, value) {
                    optin.opts[index] = value;
                });
            }
            if ('body' in json.html) {
                optin.$body.empty().append(json.html.body).show();
            }
            if ('message' in json.html) {
                optin.$message.empty().append(json.html.message).show();
            }
            optin.$loading.hide();

            if (typeof this.opts.text === 'object') {
                this.$el.find('[data-js-trans]').each(function(index, e) {
                    if (this.opts.text[$(e).data('js-trans')]) {
                        $(e).text(this.opts.text[$(e).data('js-trans')]);
                    }
                }.bind(this))
            }

            this.initEvents();
        };

        GcsOptin.prototype.initEvents = function() {
            var form = $(this.$el.find('form')[0]);
            form.on('submit', function(e) {
                    var data = {};
                    $.each(form.serializeArray(), function(i, input) {
                        data[input.name] = input.value;
                    });
                    this.request('POST', data, null, function() {

                    });
                    return false;
                }.bind(this)
            )
        }

        GcsOptin.prototype.isHeadless = function() {
            return this.opts.mode === 'headless';
        };

        GcsOptin.prototype.init = function() {
            this.$el.empty();
            this.$el.addClass(name + '__container');

            if (this.opts.loadingbar) {
                this.$loading = $(this.html.loading);
                this.$el.append(this.$loading);
            }

            this.$error = $('<div></div>').append(this.html.error);
            this.$error.hide();
            this.$el.append(this.$error);

            this.$message = $('<div></div>');
            this.$el.append(this.$message);

            this.$body = $('<div></div>');
            this.$el.append(this.$body);
        };

        GcsOptin.prototype.destroy = function() {
            this.$el.off('.' + name);
            this.$el.find('*').off('.' + name);
            this.$el.removeData(name);
            this.$el = null;
        };

        GcsOptin.prototype.fire = function(eventName) {
            if (this.opts.fireEvents) {
                this.$el.trigger(name + '.' + eventName, this);
            }
        };

        GcsOptin.prototype.getCookie = function(cname) {
            var name = cname + '=';
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return '';
        };

        GcsOptin.prototype.setCookie = function(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = 'expires=' + d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        }

        $.fn.gcsOptin = function(opts) {
            if (this.length === 0) {
                return new GcsOptin(opts);
            }
            return this.each(function() {
                new GcsOptin(opts, this);
            });
        };

        $(document).on('domloaded ajaxloaded', function(e, nodes) {
            var $nodes = $(nodes);
            var $elements = $nodes.find('.' + name);
            $elements = $elements.add($nodes.filter('.' + name));
            if ($elements.length) {
                $elements.gcsOptin();
            }
        });

        $(document).ready(function() {
            var $elements = $('.' + name);
            if ($elements.length) {
                $elements.gcsOptin();
            }
        });
    })(jQuery, document, window);
}
//# sourceMappingURL=frontend.js.map
